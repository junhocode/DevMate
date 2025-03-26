import { NotFoundError } from '../errors/httpError';
import { IPost, Post } from '../models/postModel';
import { PostLike } from '../models/PostLikesModel';
import { User } from '../models/userModel';

export const create = async (
  userId: string,
  boardId: string,
  title: string,
  content: string
): Promise<IPost> => {
  const post = await Post.create({
    userId,
    boardId,
    title,
    content,
  });
  return post;
};

export const update = async (
  postId: string,
  title: string,
  content: string
): Promise<IPost> => {
  const post = await Post.findOneAndUpdate(
    { _id: postId },
    { $set: { title: title, content: content } },
    { new: true }
  );

  if (!post) {
    throw new NotFoundError('게시글을 찾을 수 없습니다.');
  }
  return post;
};

export const deleteP = async (postId: string): Promise<void> => {
  const post = await Post.findByIdAndDelete(postId);

  if (!post) {
    throw new NotFoundError('삭제할 게시글을 찾을 수 없습니다.');
  }
};

export const getPostById = async (postId: string): Promise<IPost> => {
  const post = await Post.findById(postId);

  if (!post) {
    throw new NotFoundError('게시글을 찾을 수 없습니다.');
  }
  return post;
};

export const getPostsByBoard = async (
  boardId: string,
  currentPage: number,
  limit: number
) => {
  const posts = await Post.find({ boardId })
    .sort({ createdAt: -1 })
    .skip((currentPage - 1) * limit)
    .limit(limit);

  if (posts.length === 0) {
    throw new NotFoundError('게시글을 찾을 수 없습니다.');
  }
  const postsWithUser = await Promise.all(
    posts.map(async (post) => {
      const user = await User.findOne({ _id: post.userId }, 'username');
      if (!user) {
        throw new NotFoundError('소유자가 없는 게시글이 있습니다.');
      }
      return { ...post.toObject(), username: user.username };
    })
  );
  return postsWithUser;
};

export const getCountByBoard = async (boardId: string): Promise<number> => {
  const count = await Post.countDocuments({ boardId });
  return count;
};

export const getUserByPostId = async (postId: string): Promise<string> => {
  const post = await Post.findOne({ _id: postId }, { userId: 1 });
  if (!post) {
    throw new NotFoundError('존재하지 않는 게시물입니다');
  }
  const userId = post.userId;
  return userId;
};

export const findPostLike = async (postId: string, userId: string) => {
  return PostLike.findOne({ postId, userId });
};

export const addPostLike = async (postId: string, userId: string) => {
  return PostLike.create({ postId, userId });
};

export const removePostLike = async (postId: string, userId: string) => {
  return PostLike.deleteOne({ postId, userId });
};

export const incrementLikeCount = async (postId: string) => {
  return Post.findByIdAndUpdate(postId, { $inc: { likeCount: 1 } });
};

export const decrementLikeCount = async (postId: string) => {
  return Post.findByIdAndUpdate(postId, { $inc: { likeCount: -1 } });
};
