/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import logger from '../util/logger';
import { Chat, Reaction, User } from '../schemas';
import { Types } from 'mongoose';

export async function listMessages(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const chats = await Chat.aggregate([
      {
        $match: {
          $or: [
            {
              channel: new Types.ObjectId(req.params.id),
            },
            {
              directmessage: new Types.ObjectId(req.params.id),
            },
          ],
        },
      },
      {
        $lookup: {
          from: Reaction.collection.name,
          localField: 'reactions',
          foreignField: '_id',
          pipeline: [
            {
              $group: {
                _id: {
                  reactionType: '$reactionType',
                },
                userId: { $push: '$reactor' },
              },
            },
            {
              $lookup: {
                from: User.collection.name,
                localField: 'userId',
                foreignField: '_id',
                as: 'user_info',
              },
            },
            {
              $project: {
                _id: 0,
                reactionType: '$_id.reactionType',
                user_info: '$user_info',
              },
            },
          ],
          as: 'reactions_info',
        },
      },
      {
        $lookup: {
          from: Chat.collection.name,
          localField: 'responses',
          foreignField: '_id',
          pipeline: [
            {
              $lookup: {
                from: Reaction.collection.name,
                localField: 'reactions',
                foreignField: '_id',
                pipeline: [
                  {
                    $group: {
                      _id: {
                        reactionType: '$reactionType',
                      },
                      userId: { $push: '$reactor' },
                    },
                  },
                  {
                    $lookup: {
                      from: User.collection.name,
                      localField: 'userId',
                      foreignField: '_id',
                      as: 'user_info',
                    },
                  },
                  {
                    $project: {
                      _id: 0,
                      reactionType: '$_id.reactionType',
                      user_info: '$user_info',
                    },
                  },
                ],
                as: 'reactions_info',
              },
            },
          ],
          as: 'responses_info',
        },
      },
    ]);

    // const chats = await Chat.find({
    //   $or: [
    //     {
    //       channel: req.params.id,
    //     },
    //     {
    //       directmessage: req.params.id,
    //     },
    //   ],
    // })
    //   .populate('sender')
    //   .populate({
    //     path: 'responses',
    //     populate: {
    //       path: 'sender',
    //     },
    //   })
    //   .populate({
    //     path: 'reactions',
    //     populate: {
    //       path: 'reactor',
    //     },
    //   });
    res.json(chats);
  } catch (error: any) {
    logger.error(error.message);
    next(error);
  }
}
