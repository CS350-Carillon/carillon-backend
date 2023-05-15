import { PopulatedDoc } from 'mongoose';
import { IUser } from '../user';

export interface IChat {
  content: string;
  // reactions:
  sender: PopulatedDoc<IUser>;
  receiver: PopulatedDoc<IUser>;
}
