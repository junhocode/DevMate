import { Request, Response, NextFunction } from 'express';
import * as alarmService from '../services/alarmService';
// 알림을 본 것으로 처리
export const updateNotificationStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { notificationId } = req.params;

  try {
    const updatedNotification =
      await alarmService.updateNotificationStatusService(notificationId);
    res.status(200).json({ success: true, updatedNotification });
  } catch (error) {
    next(error);
  }
};

// 사용자 ID로 알림 정보 가져오기
export const getNotificationsByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { userId } = req.params;

  try {
    const notifications =
      await alarmService.getNotificationsByUserIdService(userId);
    res.status(200).json({ success: true, notifications });
  } catch (error) {
    next(error);
  }
};
