import { NextFunction, Request, Response } from 'express';
import * as postService from '../services/postService';
import { JwtRequest } from '../middlewares/authMiddleware';

export const createPost = async (
  req: JwtRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const userId = req.user!;
  const boardId = req.params.boardId;
  const title = req.body.title;
  const content = req.body.content;

  try {
    const createPostResponse = await postService.createPost(
      userId,
      boardId,
      title,
      content
    );
    res.status(201).json(createPostResponse);
  } catch (error) {
    next(error);
  }
};

export const updatePost = async (
  req: JwtRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const postId = req.params.postId;
  const title = req.body.title;
  const content = req.body.content;

  try {
    const updatePostResponse = await postService.updatePost(
      postId,
      title,
      content
    );
    res.status(200).json(updatePostResponse);
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (
  req: JwtRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const postId = req.params.postId;

  try {
    const deletePostResponse = await postService.deletePost(postId);
    res.status(200).json(deletePostResponse);
  } catch (error) {
    next(error);
  }
};

export const getPost = async (
  req: JwtRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const postId = req.params.postId;
  try {
    const getPostResponse = await postService.getPost(postId);
    res.status(200).json(getPostResponse);
  } catch (error) {
    next(error);
  }
};

export const getPosts = async (
  req: JwtRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const boardId = req.params.boardId;
  const currentPage = req.query.currentPage
    ? parseInt(req.query.currentPage as string, 10)
    : 1;
  const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 6;
  try {
    const getPostsResponse = await postService.getPosts(
      boardId,
      currentPage,
      limit
    );
    res.status(200).json(getPostsResponse);
  } catch (error) {
    next(error);
  }
};

export const like = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { postId } = req.params;
  const { userId } = req.body;
  try {
    // 서비스로 postId와 userId 전달
    const toggleLikeResponse = await postService.toggleLike(postId, userId);
    res.status(200).json(toggleLikeResponse);
  } catch (error) {
    next(error);
  }
};
