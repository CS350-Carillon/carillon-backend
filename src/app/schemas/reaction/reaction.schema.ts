import { Schema, Types, model } from 'mongoose';
import { IReaction } from './reaction.interface';
import { ReactionType } from './reaction.type';

const ReactionSchema = new Schema<IReaction>({
  reactionType: {
    type: String,
    enum: Object.values(ReactionType),
    required: true,
  },
  reactor: {
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

export const Reaction = model<IReaction>('Reaction', ReactionSchema);
