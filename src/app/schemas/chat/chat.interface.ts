import { PopulatedDoc } from 'mongoose';
import { IUser } from '../user';
import { IReaction } from '../reaction';

export interface IChat {
  content: string;
  reactions: PopulatedDoc<IReaction>;
  sender: PopulatedDoc<IUser>;
  receiver: PopulatedDoc<IUser>;
}
