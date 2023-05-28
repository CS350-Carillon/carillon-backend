import { PopulatedDoc } from 'mongoose';
import { IUser } from '../user';
import { IChat } from '../chat';
import { ReactionType } from './reaction.type';

export interface IReaction {
  reactionType: ReactionType;
  reactingChat: PopulatedDoc<IChat>;
  reactor: PopulatedDoc<IUser>;
}
