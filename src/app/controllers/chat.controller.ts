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
    const chats = await Chat.find();
    res.json(chats);
  } catch (error: any) {
    logger.error(error.message);
    next(error);
  }
}

export async function addResponse(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const message = await Chat.create({
      content: req.body.content,
      channel: req.body.channel,
      sender: res.locals.user.id,
    });

    await Chat.findByIdAndUpdate(req.params.id, {
      $push: {
        responses: message,
      },
    });

    res.json(message);
  } catch (error: any) {
    logger.error(error.message);
    next(error);
  }
}
