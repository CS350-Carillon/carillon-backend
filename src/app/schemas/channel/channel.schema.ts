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
  owner: [
    {
      type: Types.ObjectId,
      ref: 'User',
    },
  ],
  members: [{ type: Types.ObjectId, ref: 'User' }],
  workspace: {
    type: Types.ObjectId,
    ref: 'Workspace',
    required: true,
  },
});

ChannelSchema.pre('save', async function (next) {
  const channel = await Channel.findOne({
    name: this.name,
  });
  if (!channel) {
    return next(new Error('Channel already exists'));
  }

  next();
});

export const Channel = model<IChannel>('Channel', ChannelSchema);
