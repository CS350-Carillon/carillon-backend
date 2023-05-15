import { Schema, Types, model } from 'mongoose';
import { IReaction } from './reaction.interface';

const ReactionSchema = new Schema<IReaction>({
  name: {
    type: String,
    required: true,
  },
  reactingChat: {
    type: Types.ObjectId,
    ref: 'Chat',
    required: true,
  },
  reactor: {
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

export const Reaction = model<IReaction>('Reaction', ReactionSchema);
