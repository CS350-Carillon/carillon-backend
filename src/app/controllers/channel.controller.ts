/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import { Channel } from '../schemas';
import logger from '../util/logger';
import { Types } from 'mongoose';

export async function listChannel(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const channels = await Channel.find();
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
      owner: owner,
      members: members,
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
    const channel = await Channel.deleteOne({
      $and: [
        {
          name: req.body.name,
        },
        {
          owner: res.locals.user.id,
        },
      ],
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

    let channel = await Channel.findOneAndUpdate(
      {
        name: req.body.name,
        owner: owner,
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
