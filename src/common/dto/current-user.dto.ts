import { Role } from '@prisma/client';

export class CurrentUserDto {
  id: string;
  username: string;
  role: Role;
}
