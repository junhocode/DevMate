import { body, param, validationResult } from 'express-validator';
import mongoose from 'mongoose';
// 댓글 생성 검증
export const createCommentValidator = [
  body('content').notEmpty().withMessage('댓글 내용을 입력하세요.'),
  body('parentId')
    .optional() // ✅ parentId가 없어도 검사를 진행하지 않음
    .custom(
      (value) =>
        value === null ||
        (typeof value === 'string' && mongoose.Types.ObjectId.isValid(value))
    )
    .withMessage('유효한 부모 댓글 ID가 아닙니다.'),
  body('userId').notEmpty().withMessage('userId가 필요합니다.'),
  body('postId').notEmpty().withMessage('postId가 필요합니다.'),
];

// 댓글 수정 검증
export const updateCommentValidator = [
  param('commentId')
    .notEmpty()
    .withMessage('댓글 ID는 필수입니다.') // 비어있을 경우 추가
    .isMongoId()
    .withMessage('유효한 댓글 ID가 아닙니다.'),
  body('content').notEmpty().withMessage('댓글 내용을 입력하세요.'),
];

// 댓글 삭제 검증
export const deleteCommentValidator = [
  param('commentId')
    .notEmpty()
    .withMessage('댓글 ID는 필수입니다.') // 비어있을 경우 추가
    .isMongoId()
    .withMessage('유효한 댓글 ID가 아닙니다.'),
];

// 게시글에 달린 댓글 가져오기 검증
export const getCommentsByPostValidator = [
  param('postId')
    .notEmpty()
    .withMessage('게시글 ID는 필수입니다.') // 비어있을 경우 추가
    .isMongoId()
    .withMessage('유효한 게시글 ID가 아닙니다.'),
];

// 부모 댓글을 기준으로 대댓글 가져오기 검증
export const getRepliesByParentValidator = [
  param('parentId')
    .notEmpty()
    .withMessage('부모 댓글 ID는 필수입니다.') // 비어있을 경우 추가
    .isMongoId()
    .withMessage('유효한 부모 댓글 ID가 아닙니다.'),
];

export const validate = (req: any, res: any, next: any): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      errors: errors.array().map((error: any) => ({
        message: error.msg,
      })),
    });
  } else {
    next();
  }
};
