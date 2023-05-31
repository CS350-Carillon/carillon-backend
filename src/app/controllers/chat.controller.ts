/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import logger from '../util/logger';
import { Chat } from '../schemas';

export async function listMessages(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const chats = await Chat.find({
      $or: [
        {
          channel: req.params.id,
        },
        {
          directmessage: req.params.id,
        },
      ],
    })
      .populate('sender')
      .populate({
        path: 'responses',
        populate: {
          path: 'sender',
        },
      })
      .populate({
        path: 'reactions',
        populate: {
          path: 'reactor',
        },
      });
    res.json(chats);
  } catch (error: any) {
    logger.error(error.message);
    next(error);
  }
}
