import { Schema, Types, model } from 'mongoose';
import { IChat } from './chat.interface';
import { User } from '../user';

const ChatSchema = new Schema<IChat>({
  content: {
    type: String,
    required: true,
  },
  channel: {
    type: Types.ObjectId,
    ref: 'Channel',
  },
  responses: [
    {
      type: Types.ObjectId,
      ref: 'Chat',
    },
  ],
  reactions: [
    {
      type: Types.ObjectId,
      ref: 'Reaction',
    },
  ],
  sender: {
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

ChatSchema.pre('save', async function (next) {
  const sender = await User.findById(this.sender);
  if (!sender) {
    return next(new Error('User not found'));
  }

  if (!sender.participatingChannels.includes(this.channel)) {
    return next(new Error('User not in channel'));
  }
  next();
})

export const Chat = model<IChat>('Chat', ChatSchema);
