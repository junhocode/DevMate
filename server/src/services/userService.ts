import { NotFoundError } from '../errors/httpError';
import { IUser } from '../models/userModel';
import * as userRepository from '../repositories/userRepository';

export const checkUser = async (
  objectType: 'providerId' | 'id',
  id: string
): Promise<boolean> => {
  const userExists = await userRepository.checkUserById(objectType, id);
  return userExists;
};

export const getUser = async (
  objectType: 'providerId' | '_id',
  id: string
): Promise<IUser> => {
  const user = await userRepository.findUserById(objectType, id);
  return user;
};

export const registerUser = async (
  username: string,
  email: string,
  avatar_url: string,
  providerId: number
): Promise<void> => {
  await userRepository.createUser(username, email, avatar_url, providerId);
};

interface UserProfileUpdate {
  bio?: string;
  location?: string;
  avatar_url?: string;
  techStack?: string[];
}

export const updateUserProfile = async (
  id: string,
  profileData: UserProfileUpdate
): Promise<IUser | null> => {
  const updatedUser = await userRepository.updateUserProfileInDB(
    id,
    profileData
  );
  return updatedUser;
};

export const getUserInfo = async (id: string): Promise<IUser | null> => {
  if (!id) {
    throw new Error('ID정보가 필요합니다.');
  }

  const user = await userRepository.findUserProfileById(id);

  if (!user) {
    throw new NotFoundError('User not found');
  }

  return user;
};
