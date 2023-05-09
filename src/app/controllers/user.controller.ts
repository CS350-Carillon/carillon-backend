import { NextFunction, Request, Response } from 'express';
import { User } from '../schemas';
import { hashSync } from 'bcrypt';

export async function signup(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await User.findOne({
      userId: req.body.userId,
    });
    if (user) {
      return res.status(409).send('Duplicate user id');
    }

    const savedUser = await User.create({
      userId: req.body.userId,
      password: hashSync(req.body.password, 10),
      userName: req.body.userName,
    });
    res.json(savedUser.toJSON());
  } catch (error) {
    next(error);
  }
}
