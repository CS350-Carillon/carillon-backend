import { Schema, Types, model } from 'mongoose';
import { IDirectmessage } from './directmessage.interface';

const DirectmessageSchema = new Schema<IDirectmessage>({
  name: {
    type: String,
    required: true,
  },
  owner: {
    type: Types.ObjectId,
    ref: 'User',
    required: true,
  },
  members: [{ type: Types.ObjectId, ref: 'User' }],
  muteMembers: [{ type: Types.ObjectId, ref: 'User' }],
});

export const Directmessage = model<IDirectmessage>(
  'Directmessage',
  DirectmessageSchema,
);
