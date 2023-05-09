import { UserType } from './user.type';

export interface IUser {
  userId: string;
  password: string;
  userType: UserType;
  userName: string;
}
