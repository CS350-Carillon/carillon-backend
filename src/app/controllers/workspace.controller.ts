import { NextFunction, Request, Response } from 'express';
import { Workspace } from '../schemas/workspace';
import { Types } from 'mongoose';
import { Channel } from '../schemas';

export async function listWorkspace(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const workspaces = await Workspace.find();
    res.json(workspaces);
  } catch (error) {
    next(error);
  }
}

export async function createWorkspace(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const owner = new Types.ObjectId(res.locals.user.id);
    const members = [owner];

    const defaultChannel = await Channel.create({
      name: 'Default Channel',
      description: 'Default Channel',
      owner: owner,
      members: members,
    });
    const channels = [defaultChannel];

    const workspace = await Workspace.findOneAndUpdate(
      {
        name: req.body.name,
        owner: res.locals.user.id,
      },
      {
        name: req.body.name,
        owner: res.locals.user.id,
        members: members,
        invitationCode: generateAuthCode(),
        defaultChannel: defaultChannel._id,
        channels: channels,
      },
      {
        upsert: true,
        new: true,
      },
    );
    res.json(workspace);
  } catch (error) {
    next(error);
  }
}

export function generateAuthCode() {
  const codeLength = 6;
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;

  let result = '';
  for (let i = 0; i < codeLength; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
