import { Schema, Types, model } from 'mongoose';
import { IWorkspace } from './workspace.interface';

const WorkspaceSchema = new Schema<IWorkspace>({
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
  invitationCode: {
    type: String,
    required: true,
  },
  defaultChannel: {
    type: Types.ObjectId,
    ref: 'Channel',
  },
});

export const Workspace = model<IWorkspace>('Workspace', WorkspaceSchema);
