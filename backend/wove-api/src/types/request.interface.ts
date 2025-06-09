import { Request } from 'express';
import { User } from '../database/entities';

export interface RequestWithUser extends Request {
  user?: User;
}
