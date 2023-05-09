import { Schema, model } from 'mongoose';
import { IUser } from './user.interface';
import { UserType } from './user.type';

const UserSchema = new Schema<IUser>({
  userId: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    enum: Object.values(UserType),
    default: UserType.STUDENT,
  },
  userName: {
    type: String,
    required: true,
  },
});

export const User = model<IUser>('User', UserSchema);
