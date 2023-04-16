import { User } from 'app/entities/user.entity';

export abstract class UsersRepository {
  abstract create(user: User): Promise<void>;
}
