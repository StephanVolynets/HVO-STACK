import { RequestUser } from './auth';

declare global {
  namespace Express {
    interface User extends RequestUser {}

    interface Request {
      user?: User;
    }
  }
}
