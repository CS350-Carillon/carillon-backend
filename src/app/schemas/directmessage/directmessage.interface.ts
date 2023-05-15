import { PopulatedDoc } from 'mongoose';
import { IUser } from '../user';

export interface IDirectmessage {
  name: string;
  owner: PopulatedDoc<IUser>;
  members: PopulatedDoc<IUser>[];
  muteMembers: PopulatedDoc<IUser>[];
}
