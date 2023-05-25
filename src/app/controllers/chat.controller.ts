/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import logger from '../util/logger';
import { Chat } from '../schemas';

export async function postMessage(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    //TODO: receiver가 같은 채널에 있는지 중복체크
    const message = await Chat.create({
      content: req.body.content,
      channel: req.body.channel,
      sender: res.locals.user.id,
      receiver: req.body.receiver,
    });
    res.json(message);
  } catch (error: any) {
    logger.error(error.message);
    next(error);
  }
}
