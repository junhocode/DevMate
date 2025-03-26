import { NotFoundError } from '../errors/httpError';
import { User, IUser } from '../models/userModel';

export const checkUserById = async (
  objectType: 'providerId' | 'id',
  id: string
): Promise<boolean> => {
  const exists = await User.exists({ [objectType]: id });
  return !!exists;
};

export const findUserById = async (
  objectType: 'providerId' | '_id',
  id: string
): Promise<IUser> => {
  const user = await User.findOne({ [objectType]: id });
  if (!user) {
    throw new NotFoundError('사용자 정보가 없습니다');
  }
  return user;
};

export const createUser = async (
  username: string,
  email: string,
  avatar_url: string,
  providerId: number
): Promise<void> => {
  await User.create({
    username,
    email,
    avatar_url,
    provider: 'github',
    providerId,
    lastLoginAt: new Date(),
  });
};

export const updateUser = async (
  username: string,
  email: string,
  avatar_url: string,
  providerId: number
): Promise<void> => {
  await User.findOneAndUpdate(
    { providerId },
    {
      username,
      email,
      avatar_url,
      provider: 'github',
      providerId,
      lastLoginAt: new Date(),
    },
    { upsert: true, new: true }
  );
};

export interface UserProfileUpdate {
  bio?: string;
  location?: string;
  techStack?: string[];
  avatar_url?: string;
}

export const updateUserProfileInDB = async (
  id: string,
  profileData: UserProfileUpdate
): Promise<IUser | null> => {
  const updatedUser = await User.findByIdAndUpdate(id, profileData, {
    new: true,
    runValidators: true,
  }).select('username email avatar_url bio contact location techStack ');

  return updatedUser;
};

export const findUserProfileById = async (id: string) => {
  const user = await User.findById(id).exec();
  return user;
};
