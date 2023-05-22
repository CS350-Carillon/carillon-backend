/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import { Channel, Workspace } from '../schemas';
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

    const workspace = await Workspace.findOne({
      name: req.body.workspace,
    });
    if (!workspace) {
      return res.status(404);
    }

    const channel = await Channel.findOneAndUpdate(
      {
        name: req.body.name,
        workspace: workspace,
      },
      {
        name: req.body.name,
        description: req.body.description,
        owner: owner,
        members: members,
        workspace: workspace,
      },
      {
        upsert: true,
        new: true,
      },
    );

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

export async function updateChannels(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const owner = new Types.ObjectId(res.locals.user.id);
    const addedMembers = req.body.addedMembers;
    const kickedMembers = req.body.kickedMembers;

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
