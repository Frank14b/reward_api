import { User } from './user.types';

export interface AuthRequest extends Request {
  user?: User | null;
}
