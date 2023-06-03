/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import logger from '../util/logger';
import { Chat, Reaction, User } from '../schemas';
import { Types } from 'mongoose';
import { getFileAddress, uploadImageToS3 } from '../util/s3';

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
        $match: {
          isResponse: false,
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
      {
        $lookup: {
          from: User.collection.name,
          localField: 'sender',
          foreignField: '_id',
          as: 'sender_info',
        },
      },
    ]);

    res.json(chats);
  } catch (error: any) {
    logger.error(error.message);
    next(error);
  }
}

export async function uploadImage(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    logger.debug(`Uploading file ${req.file?.originalname}`);
    uploadImageToS3(req.file!.originalname, req.file!.buffer);
    res.json(getFileAddress(req.file!.originalname));
  } catch (error) {
    next(error);
  }
}
