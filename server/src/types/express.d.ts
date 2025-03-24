import { UserDocument } from '../core/database/models/user.model';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
      } & Partial<UserDocument>;
    }
  }
}