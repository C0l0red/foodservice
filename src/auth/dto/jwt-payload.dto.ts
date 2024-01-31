import { Role } from '@prisma/client';

export class JwtPayloadDto {
  username: string;
  sub: string;
  role: Role;
}
