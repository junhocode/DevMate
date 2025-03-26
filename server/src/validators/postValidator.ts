import { NextFunction, Request, Response } from 'express';
import { body, param, query, validationResult } from 'express-validator';
import { BadRequestError } from '../errors/httpError';

export const createPostValidationRules = () => {
  return [
    param('boardId')
      .notEmpty()
      .withMessage('게시판 아이디는 필수입니다')
      .isIn(['study', 'toy', 'code'])
      .withMessage(
        '게시판 아이디는 "study" | "toy" | "code" 중 하나여야 합니다'
      ),
    body('title').notEmpty().withMessage('게시글 제목은 필수입니다'),
    body('content').notEmpty().withMessage('게시글 내용은 필수입니다'),
  ];
};

export const updatePostValidationRules = () => {
  return [
    param('postId').notEmpty().withMessage('게시글 아이디는 필수입니다'),
    body('title').notEmpty().withMessage('게시글 제목은 필수입니다'),
    body('content').notEmpty().withMessage('게시글 내용은 필수입니다'),
  ];
};

export const deletePostValidationRules = () => {
  return [param('postId').notEmpty().withMessage('게시글 아이디는 필수입니다')];
};

export const getPostValidationRules = () => {
  return [param('postId').notEmpty().withMessage('게시글 아이디는 필수입니다')];
};

export const getPostsValidationRules = () => {
  return [
    param('boardId')
      .notEmpty()
      .withMessage('게시판 아이디는 필수입니다')
      .isIn(['study', 'toy', 'code'])
      .withMessage(
        '게시판 아이디는 "study" | "toy" | "code" 중 하나여야 합니다'
      ),
    query('currentPage')
      .optional()
      .isInt({ min: 1 })
      .withMessage('현재 페이지는 1 이상의 정수여야 합니다'),
    query('limit')
      .optional()
      .isInt({ min: 1 })
      .withMessage('limit은 1 이상의 정수여야 합니다'),
  ];
};

export const likePostValidationRules = () => {
  return [
    // postId 검증
    param('postId')
      .notEmpty()
      .withMessage('게시물 아이디는 필수입니다')
      .isString()
      .withMessage('게시물 아이디는 문자열이어야 합니다'),

    // userId 검증
    body('userId')
      .notEmpty()
      .withMessage('사용자 아이디는 필수입니다')
      .isString()
      .withMessage('사용자 아이디는 문자열이어야 합니다'),
  ];
};

export const validatePost = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessage = errors
      .array()
      .map((err) => err.msg)
      .join(', ');

    next(new BadRequestError(errorMessage));
  }
  next();
};
