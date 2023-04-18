import { UsersRepository } from '@app/repositories/users.repository';
import { makeHash } from '@helpers/hash';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomBytes } from 'crypto';

type GoogleSignInRequest = {
  first_name: string;
  last_name: string;
  email: string;
};

@Injectable()
export class GoogleSignInService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  public async run({ email, first_name, last_name }: GoogleSignInRequest) {
    let foundUser = null;
    foundUser = await this.usersRepository.findByEmail(email);

    if (!foundUser) {
      foundUser = await this.usersRepository.create({
        email,
        first_name,
        last_name,
        password: makeHash(randomBytes(8).toString('hex')),
      });
    }

    const payload = { sub: foundUser.id };

    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
    };
  }
}
