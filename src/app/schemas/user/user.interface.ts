import { Model } from 'mongoose';
import { UserType } from './user.type';

export interface IUser {
  userId: string;
  password: string;
  userType: UserType;
  userName: string;
}

export interface UserModel extends Model<IUser> {
  toJSON(): { [key: string]: string };
}
