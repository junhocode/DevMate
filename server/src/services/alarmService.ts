import { Notification } from '../models/notificationModel';
import { NotFoundError } from '../errors/httpError';

export const updateNotificationStatusService = async (
  notificationId: string
) => {
  const notification = await Notification.findById(notificationId);

  if (!notification) {
    throw new NotFoundError('알림을 찾을 수 없습니다.');
  }

  notification.isRead = true;
  await notification.save();
  return notification;
};

export const getNotificationsByUserIdService = async (userId: string) => {
  const notifications = await Notification.find({ userId, isRead: false })
    .sort({ createdAt: -1 })
    .lean(); // 최신 알림부터 정렬
  return notifications;
};

export async function createNotification(notificationData: {
  type: 'COMMENT' | 'REPLY' | 'LIKE' | 'FOLLOW'; // 알림 유형
  targetUserId: string; // 알림 받을 사용자 ID
  sourceUserId: string; // 알림을 발생시킨 사용자 ID
  postId?: string; // 게시글 ID (선택적)
  commentId?: string; // 댓글 ID (선택적)
  message: string; // 알림 메시지
}) {
  const { type, targetUserId, sourceUserId, postId, commentId, message } =
    notificationData;

  // 알림 생성 데이터 준비
  const notification = new Notification({
    userId: targetUserId,
    type,
    sourceUserId,
    postId: postId || null,
    commentId: commentId || null,
    content: message,
    isRead: false, // 기본값
  });

  // 데이터베이스에 알림 저장
  try {
    await notification.save();
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : String(error));
  }
}
