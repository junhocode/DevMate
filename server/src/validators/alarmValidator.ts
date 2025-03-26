import { param, validationResult } from 'express-validator';

// 알림 본 것으로 처리 검증
export const updateNotificationStatusValidator = [
  param('notificationId')
    .notEmpty()
    .withMessage('알림 ID는 필수입니다.') // 비어있을 경우 추가
    .isMongoId()
    .withMessage('유효한 알림 ID가 아닙니다.'),
];

// 사용자 ID로 알림 정보 가져오기 검증
export const getNotificationsByUserIdValidator = [
  param('userId')
    .notEmpty()
    .withMessage('사용자 ID는 필수입니다.') // 비어있을 경우 추가
    .isMongoId()
    .withMessage('유효한 사용자 ID가 아닙니다.'),
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
