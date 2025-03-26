import {
  createComment,
  updateComment,
  deleteComment,
  getCommentsByPostId,
  getRepliesByParentId,
} from '../repositories/commentRepository';
import { IComment } from '../models/commentModel';
export const createCommentService = async (
  userId: string,
  postId: string,
  content: string,
  parentId?: string
): Promise<IComment> => {
  const createdComment = await createComment(userId, postId, content, parentId);
  return createdComment;
};

export const updateCommentService = async (
  commentId: string,
  content: string
) => {
  const updatedComment = await updateComment(commentId, content);
  return updatedComment;
};

export const deleteCommentService = async (commentId: string) => {
  await deleteComment(commentId);
  return true;
};

export const getCommentsByPostService = async (
  postId: string,
  currentPage: number = 1, // 기본값 1
  limit: number = 10 // 기본값 10
) => {
  const skip = (currentPage - 1) * limit;
  const comments = await getCommentsByPostId(postId, skip, limit);
  return comments;
};

export const getRepliesByParentService = async (parentId: string) => {
  const replies = await getRepliesByParentId(parentId);
  return replies;
};
