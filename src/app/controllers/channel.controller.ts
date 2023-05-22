import { NextFunction, Request, Response } from 'express';
import { Channel } from '../schemas';
import logger from '../util/logger';
import { Types } from 'mongoose';

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
