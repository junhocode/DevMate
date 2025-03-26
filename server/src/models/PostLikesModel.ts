import mongoose, { Schema, Document } from 'mongoose';

export interface IPostLike extends Document {
  postId: string; // 좋아요가 적용된 게시글 ID
  userId: string; // 좋아요를 누른 사용자 ID
  createdAt: Date; // 좋아요 누른 시간
}

const postLikeSchema = new Schema<IPostLike>(
  {
    postId: {
      type: String,
      required: true,
      index: true, // 검색 성능 향상을 위한 인덱스
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt 자동 관리
  }
);

// postId와 userId의 조합이 유니크하도록 설정
postLikeSchema.index({ postId: 1, userId: 1 }, { unique: true });

export const PostLike = mongoose.model<IPostLike>('PostLike', postLikeSchema);
