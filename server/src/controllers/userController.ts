import { JwtRequest } from '../middlewares/authMiddleware';
import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from '../errors/httpError';
import * as userService from '../services/userService';

dotenv.config();

export const redirectToGitHub = (req: Request, res: Response): void => {
  const redirectURI = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${process.env.GITHUB_CALLBACK_URL}&scope=user:email`;
  res.redirect(redirectURI);
};

export const handleGitHubCallback = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const code = req.query.code as string;

  if (!code) {
    throw new BadRequestError(
      '깃허브 접근에 필요한 Authorization code를 찾을 수 없습니다'
    );
  }

  try {
    const tokenResponse = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET_KEY,
        code,
      },
      { headers: { Accept: 'application/json' } }
    );

    const githubAccessToken = tokenResponse.data.access_token;
    if (!githubAccessToken) {
      throw new UnauthorizedError(
        '깃허브에 접근하기 위한 엑세스 토큰을 찾을 수 없습니다'
      );
    }

    const userResponse = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${githubAccessToken}` },
    });

    const providerId = userResponse.data.id;
    const checkUserExists = await userService.checkUser(
      'providerId',
      providerId
    );

    if (!checkUserExists) {
      const userEmailResponse = await axios.get(
        'https://api.github.com/user/emails',
        {
          headers: { Authorization: `Bearer ${githubAccessToken}` },
        }
      );

      const avatar_url = userResponse.data.avatar_url;
      const username = userResponse.data.login;
      const email = userEmailResponse.data.find(
        (email: any) => email.primary
      )?.email;

      if (!email) {
        throw new NotFoundError('깃허브에 등록된 이메일이 없습니다');
      }

      await userService.registerUser(username, email, avatar_url, providerId);
    }

    const user = await userService.getUser('providerId', providerId);
    const refreshToken = jwt.sign(
      { userId: user._id, tokenType: 'refresh' },
      process.env.JWT_REFRESH_SECRET_KEY!,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN! }
    );
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
    });

    const accessToken = jwt.sign(
      { userId: user._id, tokenType: 'access' },
      process.env.JWT_ACCESS_SECRET_KEY!,
      {
        expiresIn: process.env.JWT_ACCESS_EXPIRES_IN!,
      }
    );
    res.status(200).json({
      message: '깃허브 로그인 성공',
      token: {
        accessToken: accessToken,
        tokenType: 'Bearer',
        expiresIn: process.env.JWT_ACCESS_EXPIRES_IN!,
      },
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar_url: user.avatar_url,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { refreshToken } = req.cookies;
  try {
    if (!refreshToken) {
      throw new UnauthorizedError('리프레시 토큰이 없습니다');
    }

    const tokenPayload = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET_KEY!
    ) as {
      userId: string;
      tokenType: string;
    };
    if (tokenPayload.tokenType !== 'refresh') {
      throw new UnauthorizedError('리프레시 토큰이 아닙니다');
    }

    const user = await userService.getUser('_id', tokenPayload.userId);
    const newAccessToken = jwt.sign(
      { userId: user._id, tokenType: 'access' },
      process.env.JWT_ACCESS_SECRET_KEY!,
      {
        expiresIn: process.env.JWT_ACCESS_EXPIRES_IN!,
      }
    );

    res.status(200).json({
      message: '액세스 토큰이 재발급되었습니다',
      token: {
        accessToken: newAccessToken,
        tokenType: 'Bearer',
        expiresIn: process.env.JWT_ACCESS_EXPIRES_IN!,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getMyPage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;
  try {
    const user = await userService.getUserInfo(id);
    res.status(200).json({ message: '유저 정보 조회 성공', user });
  } catch (error) {
    next(error);
  }
};

export const upsertProfile = async (
  req: JwtRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const id = req.params.id;
  const { bio, location, techStack, avatar_url } = req.body;
  try {
    const updatedUser = await userService.updateUserProfile(id!, {
      bio,
      location,
      techStack,
      avatar_url,
    });

    if (!updatedUser) {
      res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
      return;
    }

    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    next(error);
  }
};
