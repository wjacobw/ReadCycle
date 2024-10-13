import { Request } from 'express';
import { User } from '../../schemas/User.schema';

export interface RequestWithUser extends Request {
  user: User;
}
