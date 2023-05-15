import { Schema, Types, model } from 'mongoose';
import { IChat } from './chat.interface';

const ChatSchema = new Schema<IChat>({
  content: {
    type: String,
    required: true,
  },
  sender: {
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  },
  receiver: {
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

export const Chat = model<IChat>('Chat', ChatSchema);
