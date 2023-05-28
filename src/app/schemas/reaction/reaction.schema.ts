import { Schema, Types, model } from 'mongoose';
import { IReaction } from './reaction.interface';
import { ReactionType } from './reaction.type';

const ReactionSchema = new Schema<IReaction>({
  reactionType: {
    type: Number,
    enum: Object.values(ReactionType),
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
