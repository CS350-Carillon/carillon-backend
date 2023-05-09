import { NextFunction, Request, Response } from 'express';
import { User } from '../schemas';
import { compareSync, hashSync } from 'bcrypt';

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

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await User.findOne({
      userId: req.body.userId,
    });
    if (!user) {
      return res.status(401).send('Invalid user id');
    }

    if (!compareSync(req.body.password, user.password)) {
      return res.status(401).send('Invalid password');
    }
    res.json(user.toJSON());
  } catch (error) {
    next(error);
  }
}

export async function checkInformation(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(401).send('Invalid user id');
    }
    res.json(user.toJSON());
  } catch (error) {
    next(error);
  }
}
