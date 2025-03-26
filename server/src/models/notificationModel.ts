import mongoose, { Schema, Document } from 'mongoose';

// 알림 타입 열거형
export type NotificationType = 'COMMENT' | 'REPLY' | 'LIKE' | 'FOLLOW';

// 알림 인터페이스
export interface INotification extends Document {
  userId: string; // 알림 받을 사용자
  type: NotificationType; // 알림 종류
  sourceUserId: string; // 알림을 발생시킨 사용자
  postId?: string; // 게시글 ID (선택적)
  commentId?: string; // 댓글 ID (선택적)
  content: string; // 알림 내용
  isRead: boolean; // 읽음 여부
}

const notificationSchema = new Schema<INotification>(
  {
    userId: { type: String, required: true }, // 알림을 받을 사용자 ID
    type: {
      type: String,
      enum: ['COMMENT', 'REPLY', 'LIKE', 'FOLLOW'],
      required: true,
    }, // 알림 유형
    sourceUserId: { type: String, required: true }, // 알림을 발생시킨 사용자 ID
    postId: { type: String, default: null }, // 게시글 ID (필요 시)
    commentId: { type: String, default: null }, // 댓글 ID (필요 시)
    content: { type: String, required: true }, // 알림 메시지
    isRead: { type: Boolean, default: false }, // 읽음 상태 (기본값: false)
  },
  {
    timestamps: true, // 생성/수정 시간 자동 기록
  }
);

// 알림 모델 생성
export const Notification = mongoose.model<INotification>(
  'Notification',
  notificationSchema
);
