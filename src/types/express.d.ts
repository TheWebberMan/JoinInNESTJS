import type { UserDto } from '../users/dto/user.dto.js';

declare global {
  namespace Express {
    interface User extends UserDto {}

    interface Request {
      user?: User;
    }
  }
}