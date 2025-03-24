import { UserDocument } from '../core/database/models/user.model';
import * as express from "express"

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
      } & Partial<UserDocument>;
    }
  }
}