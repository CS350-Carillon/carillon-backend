import { Schema, Types, model } from 'mongoose';
import { IChannel } from './channel.interface';

const ChannelSchema = new Schema<IChannel>({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  owner: {
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  },
  members: [{ type: Types.ObjectId, ref: 'User' }],
});

export const Channel = model<IChannel>('Channel', ChannelSchema);
