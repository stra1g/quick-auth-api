import {
  CreateUsersInput,
  EditUsersInput,
} from '@app/interfaces/user.interface';
import { User } from '@prisma/client';

export abstract class UsersRepository {
  abstract create(data: CreateUsersInput): Promise<User>;
  abstract findByEmail(email: string): Promise<User | undefined>;
  abstract findById(id: string): Promise<User | undefined>;
  abstract edit(userId: string, data: EditUsersInput): Promise<void>;
}
