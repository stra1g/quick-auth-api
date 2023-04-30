import { UsersOutputWithoutSensitive } from '@app/interfaces/user.interface';
import { UsersRepository } from '@app/repositories/users.repository';
import { makeHash } from '@helpers/hash';
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

    const user = await this.usersRepository.create({
      ...payload,
      password: makeHash(payload.password),
    });

    return {
      user: {
        email: user.email,
        email_verified: user.email_verified,
        first_name: user.first_name,
        last_name: user.last_name,
        is_2fa_enabled: user.is_2fa_enabled,
        strategy_2fa: user.strategy_2fa,
        id: user.id,
      },
    };
  }
}
