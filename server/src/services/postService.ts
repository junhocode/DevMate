import {
  ICreatePostResponse,
  IDeletePostResponse,
  IGetPostResponse,
  IGetPostsResponse,
  IUpdatePostResponse,
} from '../models/postModel';
import {
  create,
  deleteP,
  getCountByBoard,
  getPostById,
  getPostsByBoard,
  update,
  findPostLike,
  addPostLike,
  removePostLike,
  incrementLikeCount,
  decrementLikeCount,
} from '../repositories/postRepository';
import { findUserById } from '../repositories/userRepository';

export const createPost = async (
  userId: string,
  boardId: string,
  title: string,
  content: string
): Promise<ICreatePostResponse> => {
  const createdPost = await create(userId, boardId, title, content);
  const createPostResponse = {
    success: true,
    createdPost,
  };
  return createPostResponse;
};

export const updatePost = async (
  postId: string,
  title: string,
  content: string
): Promise<IUpdatePostResponse> => {
  const updatedPost = await update(postId, title, content);
  const updatePostResponse = {
    success: true,
    updatedPost,
  };
  return updatePostResponse;
};

export const deletePost = async (
  postId: string
): Promise<IDeletePostResponse> => {
  await deleteP(postId);
  const deletePostResponse = {
    success: true,
  };
  return deletePostResponse;
};

export const getPost = async (postId: string): Promise<IGetPostResponse> => {
  let post = await getPostById(postId);
  const user = await findUserById('_id', post.userId);
  const result = { ...post.toObject(), username: user.username };
  const getPostResponse = {
    success: true,
    post: result,
  };
  return getPostResponse;
};

export const getPosts = async (
  boardId: string,
  currentPage: number,
  limit: number
): Promise<IGetPostsResponse> => {
  const posts = await getPostsByBoard(boardId, currentPage, limit);
  const total = await getCountByBoard(boardId);
  const getPostsResponse = {
    success: true,
    total: total,
    posts: posts,
  };
  return getPostsResponse;
};

export const toggleLike = async (postId: string, userId: string) => {
  const existingLike = await findPostLike(postId, userId);
  if (existingLike) {
    // 좋아요 취소
    await removePostLike(postId, userId);
    await decrementLikeCount(postId);
    return { success: true, message: '좋아요 취소' };
  } else {
    // 좋아요 추가
    await addPostLike(postId, userId);
    await incrementLikeCount(postId);
    return { success: true, message: '좋아요 추가' };
  }
};
