import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { ForbiddenError, UnauthorizedError } from '../errors/httpError';
import { getUserByPostId } from '../repositories/postRepository';
import { getUserByCommentId } from '../repositories/commentRepository';

export interface JwtRequest extends Request {
  user?: string;
}

export interface ExtendedJwtPayload extends JwtPayload {
  userId: string;
}

const isUserPayload = (
  decoded: jwt.JwtPayload
): decoded is ExtendedJwtPayload => {
  return 'userId' in decoded && typeof decoded.userId === 'string';
};

const parseAndDecode = (
  authorizationHeader: string | undefined
): ExtendedJwtPayload => {
  if (!authorizationHeader) {
    throw new UnauthorizedError('인증을 위한 Authorization 헤더가 없습니다');
  }

  const tokenParts = authorizationHeader.split(' ');
  if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
    throw new UnauthorizedError('Authorization 헤더 형식이 잘못되었습니다');
  }

  const accessToken = tokenParts[1];
  const decoded = jwt.decode(accessToken);
  if (!decoded) {
    throw new UnauthorizedError('토큰이 유효하지 않습니다');
  }

  if (typeof decoded === 'string') {
    throw new UnauthorizedError('토큰이 잘못된 형식입니다');
  }

  if (decoded.tokenType != 'access') {
    throw new UnauthorizedError('엑세스 토큰이 아닙니다');
  }

  if (decoded.exp && Date.now() / 1000 > decoded.exp) {
    throw new UnauthorizedError('토큰이 만료되었습니다');
  }

  if (!isUserPayload(decoded)) {
    throw new UnauthorizedError('토큰에 필요한 정보가 없습니다');
  }

  return decoded;
};

export const authOnlyLoggedIn = async (
  req: JwtRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const accessToken = req.headers.authorization;
  try {
    const tokenContent = parseAndDecode(accessToken);
    if (!tokenContent || !tokenContent.userId) {
      throw new UnauthorizedError('토큰에 유효한 사용자 정보가 없습니다');
    }
    const tokenUserId = tokenContent.userId;
    req.user = tokenUserId;
    next();
  } catch (error) {
    next(error);
  }
};

export const authWithPostId = async (
  req: JwtRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const accessToken = req.headers.authorization;
  const postId = req.params.postId;
  try {
    const tokenContent = parseAndDecode(accessToken);
    if (!tokenContent || !tokenContent.userId) {
      throw new UnauthorizedError('토큰에 유효한 사용자 정보가 없습니다');
    }
    const tokenUserId = tokenContent.userId;

    const requestedUserId = await getUserByPostId(postId);
    if (tokenUserId !== requestedUserId) {
      throw new ForbiddenError('이 작업을 수행할 권한이 없습니다');
    }
    req.user = tokenUserId;
    next();
  } catch (error) {
    next(error);
  }
};

export const authWithCommentId = async (
  req: JwtRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const accessToken = req.headers.authorization;
  const commentId = req.params.commentId; // 요청된 commentId를 가져옴
  try {
    // 쿠키에서 JWT 토큰을 디코드하고 사용자 정보를 가져옴
    const tokenContent = parseAndDecode(accessToken);
    if (!tokenContent || !tokenContent.userId) {
      throw new UnauthorizedError('토큰에 유효한 사용자 정보가 없습니다');
    }
    const tokenUserId = tokenContent.userId;

    // commentId를 사용해 댓글 작성자의 userId를 가져옴
    const requestedUserId = await getUserByCommentId(commentId);
    if (tokenUserId !== requestedUserId) {
      throw new ForbiddenError('이 작업을 수행할 권한이 없습니다');
    }
    req.user = tokenUserId;
    next();
  } catch (error) {
    next(error);
  }
};
