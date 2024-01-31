import * as bcrypt from 'bcrypt';
import { NotFoundException } from '@nestjs/common';

export async function hashString(text: string) {
  return bcrypt.hash(text, 10);
}

export function throwIfNull<T>(obj: T) {
  if (obj == null) {
    throw new NotFoundException();
  }
  return obj;
}
