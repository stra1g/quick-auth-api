import { User } from '@app/entities/user.entity';
import { UsersRepository } from '@app/repositories/users.repository';
import { Injectable } from '@nestjs/common';

interface CreateUserRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

interface CreateUserResponse {
  user: User;
}

@Injectable()
export class CreateUserService {
  constructor(private readonly usersRepository: UsersRepository) {}

  public async run(payload: CreateUserRequest): Promise<CreateUserResponse> {
    const user = new User(payload);

    await this.usersRepository.create(user);

    return { user };
  }
}
