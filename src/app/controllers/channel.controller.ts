/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import { Channel, User, Workspace } from '../schemas';
import logger from '../util/logger';
import { Types } from 'mongoose';

export async function listChannel(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const channels = await Channel.find().populate('workspace');
    res.json(channels);
  } catch (error: any) {
    logger.error(error.message);
    next(error);
  }
}

export async function createChannel(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const owner = new Types.ObjectId(res.locals.user.id);
    const members = [owner];

    if (req.body.members !== undefined) {
      members.push(...req.body.members);
    }

    const channel = await Channel.create({
      name: req.body.name,
      description: req.body.description,
      owner: members,
      members: members,
    });

    await User.findByIdAndUpdate(owner, {
      $push: {
        owningChannels: channel._id,
        participatingChannels: channel._id,
      },
    });
    res.json(channel);
  } catch (error: any) {
    logger.error(error.message);
    next(error);
  }
}

export async function deleteChannel(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const workspace = await Workspace.findOne({
      name: req.body.workspace,
    });
    if (!workspace) {
      return res.status(404);
    }

    const channel = await Channel.deleteOne({
      name: req.body.name,
      owner: res.locals.user.id,
      workspace: workspace,
    });
    res.json(channel);
  } catch (error: any) {
    logger.error(error.message);
    next(error);
  }
}

//TODO: 기능 분리
//TODO: add member & kick member 소켓과 연결
export async function updateChannels(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const owner = new Types.ObjectId(res.locals.user.id);
    const addedMembers = req.body.addedMembers;
    const kickedMembers = req.body.kickedMembers;
    const addedOwner = req.body.addedOwner;

    const workspace = await Workspace.findOne({
      name: req.body.workspace,
    });
    if (!workspace) {
      return res.status(404);
    }

    let channel = await Channel.findOneAndUpdate(
      {
        name: req.body.name,
        owner: owner,
        workspace: workspace,
      },
      {
        description: req.body.description,
        $push: {
          members: addedMembers,
          owner: addedOwner,
        },
      },
      {
        new: true,
      },
    );

    channel = await Channel.findOneAndUpdate(
      {
        name: req.body.name,
        owner: owner,
        workspace: workspace,
      },
      {
        $pull: {
          members: {
            $in: kickedMembers,
          },
        },
      },
      {
        new: true,
      },
    );

    res.json(channel);
  } catch (error: any) {
    logger.error(error.message);
    next(error);
  }
}
