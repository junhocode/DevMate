import { Request, Response, NextFunction } from 'express';
import * as commentService from '../services/commentService';
import { NotificationType } from '../models/notificationModel';
import { getPostById } from '../repositories/postRepository';
import { sendSSE } from '../utils/sse';

// 댓글 생성 (대댓글 포함)
export const createComment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { postId, content, parentId } = req.body; // parentId는 대댓글을 위한 optional 필드
  const userId = req.body.userId; // Assume user ID is available from authentication middleware

  try {
    const createdComment = await commentService.createCommentService(
      userId,
      postId,
      content,
      parentId || null
    );
    const post = await getPostById(postId); // 먼저 post를 await로 가져옵니다.
    const postUserId = post.userId; // 이제 실제 post 객체에서 userId에 접근할 수 있습니다.
    // 알림 생성 데이터 준비
    const notificationData: {
      type: NotificationType;
      targetUserId: string;
      sourceUserId: string;
      postId: string;
      commentId: string;
      message: string;
    } = {
      type: parentId ? 'REPLY' : 'COMMENT', // 'REPLY' 또는 'COMMENT'를 명시적으로 지정
      targetUserId: createdComment.parentId
        ? createdComment.parentId // 대댓글의 부모 댓글 작성자 ID
        : postUserId, // 댓글의 게시글 작성자 ID
      sourceUserId: userId, // 알림을 발생시킨 사용자
      postId: createdComment.postId,
      commentId: createdComment._id.toString(),
      message: parentId
        ? '회원님이 남긴 댓글에 답글이 작성되었습니다.'
        : '회원님의 게시글에 댓글이 작성되었습니다.',
    };
    res.status(201).json({ success: true, comment: createdComment });

    // 알림 생성
    setImmediate(() => {
      sendSSE(notificationData.targetUserId, notificationData.message);
    });
  } catch (error) {
    next(error);
  }
};

// 댓글 수정
export const updateComment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { commentId } = req.params;
  const { content } = req.body;

  try {
    const updatedComment = await commentService.updateCommentService(
      commentId,
      content
    );
    res.status(200).json(updatedComment);
  } catch (error) {
    next(error);
  }
};

// 댓글 삭제
export const deleteComment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { commentId } = req.params;

  try {
    await commentService.deleteCommentService(commentId);
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

// 특정 게시글의 댓글을 가져오기 (대댓글 포함)
export const getCommentsByPost = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { postId } = req.params;
  const { currentPage, limit } = req.query;

  try {
    const comments = await commentService.getCommentsByPostService(
      postId,
      Number(currentPage),
      Number(limit)
    );
    res.status(200).json({ success: true, comments });
  } catch (error) {
    next(error);
  }
};

// 부모 댓글을 기준으로 대댓글 가져오기
export const getRepliesByParent = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { parentId } = req.params;

  try {
    const replies = await commentService.getRepliesByParentService(parentId);
    res.status(200).json({ success: true, replies });
  } catch (error) {
    next(error);
  }
};
