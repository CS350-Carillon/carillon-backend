import { PopulatedDoc } from 'mongoose';
import { IUser } from '../user';
import { IReaction } from '../reaction';
import { IChannel } from '../channel';

export interface IChat {
  content: string;
  channel: PopulatedDoc<IChannel>;
  reactions: PopulatedDoc<IReaction>[];
  sender: PopulatedDoc<IUser>;
  receiver: PopulatedDoc<IUser>;
}
