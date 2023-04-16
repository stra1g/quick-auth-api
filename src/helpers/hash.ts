import { compareSync, hashSync } from 'bcrypt';

export const makeHash = (value: string) => hashSync(value, 10);

export const verifyHash = (plainValue: string, hashedValue: string) =>
  compareSync(plainValue, hashedValue);
