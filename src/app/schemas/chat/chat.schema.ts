import { Schema, Types, model } from 'mongoose';
import { IChat } from './chat.interface';

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

export const Chat = model<IChat>('Chat', ChatSchema);
