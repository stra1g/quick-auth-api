import {
  CreateUsersInput,
  EditUsersInput,
  User,
} from '@app/interfaces/user.interface';

export abstract class UsersRepository {
  abstract create(data: CreateUsersInput): Promise<User>;
  abstract findByEmail(email: string): Promise<User | undefined>;
  abstract edit(userId: string, data: EditUsersInput): Promise<void>;
}
