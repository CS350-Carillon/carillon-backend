import { PopulatedDoc } from 'mongoose';
import { IUser } from '../user';

export interface IChannel {
  name: string;
  description: string;
  owner: PopulatedDoc<IUser>[];
  members: PopulatedDoc<IUser>[];
}
