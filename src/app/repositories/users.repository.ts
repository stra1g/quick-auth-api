import {
  CreateUsersInput,
  UsersOutputWithoutSensitive,
  User,
} from '@app/interfaces/user.interface';

export abstract class UsersRepository {
  abstract create(data: CreateUsersInput): Promise<UsersOutputWithoutSensitive>;
  abstract findByEmail(email: string): Promise<User | undefined>;
}
