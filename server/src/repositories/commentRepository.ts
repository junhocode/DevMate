import { Comment, IComment } from '../models/commentModel';
import { NotFoundError } from '../errors/httpError';

export const createComment = async (
  userId: string,
  postId: string,
  content: string,
  parentId?: string
): Promise<IComment> => {
  const comment = await Comment.create({
    userId,
    postId,
    content,
    parentId: parentId || null,
  });
  return comment.toObject() as IComment;
};

export const updateComment = async (
  commentId: string,
  content: string
): Promise<IComment> => {
  const comment = await Comment.findOneAndUpdate(
    { _id: commentId },
    { $set: { content } },
    { new: true }
  );

  if (!comment) {
    throw new NotFoundError('댓글을 찾을 수 없습니다.');
  }
  return comment.toObject() as IComment;
};

export const deleteComment = async (commentId: string): Promise<void> => {
  const comment = await Comment.findByIdAndDelete(commentId);

  if (!comment) {
    throw new NotFoundError('삭제할 댓글을 찾을 수 없습니다.');
  }
};

export const getCommentsByPostId = async (
  postId: string,
  skip: number,
  limit: number
): Promise<IComment[]> => {
  const comments = await Comment.find({ postId })
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 })
    .lean();
  return comments;
};

export const getRepliesByParentId = async (
  parentId: string
): Promise<IComment[]> => {
  const replies = await Comment.find({ parentId }).lean();
  return replies;
};

export const getUserByCommentId = async (
  commentId: string
): Promise<string> => {
  const comment = await Comment.findById(commentId).select('userId').lean();

  if (!comment || !comment.userId) {
    throw new NotFoundError('댓글을 찾을 수 없습니다.');
  }

  return comment.userId.toString();
};
