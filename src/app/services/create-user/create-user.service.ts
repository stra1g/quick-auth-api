import { UsersOutputWithoutSensitive } from '@app/interfaces/user.interface';
import { UsersRepository } from '@app/repositories/users.repository';
import { BadRequestException, Injectable } from '@nestjs/common';

interface CreateUserRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

interface CreateUserResponse {
  user: UsersOutputWithoutSensitive;
}

@Injectable()
export class CreateUserService {
  constructor(private readonly usersRepository: UsersRepository) {}

  public async run(payload: CreateUserRequest): Promise<CreateUserResponse> {
    const emailAlreadyExists = await this.usersRepository.findByEmail(
      payload.email,
    );

    if (emailAlreadyExists)
      throw new BadRequestException('Email already exists');

    const user = await this.usersRepository.create(payload);

    return {
      user: {
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        id: user.id,
      },
    };
  }
}
