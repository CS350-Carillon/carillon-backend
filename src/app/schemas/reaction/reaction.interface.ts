import { PopulatedDoc } from 'mongoose';
import { IUser } from '../user';
import { IChat } from '../chat';

export interface IReaction {
  name: string;
  reactingChat: PopulatedDoc<IChat>;
  reactor: PopulatedDoc<IUser>;
}
