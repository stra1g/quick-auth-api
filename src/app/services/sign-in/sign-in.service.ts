import { UsersRepository } from '@app/repositories/users.repository';
import { verifyHash } from '@helpers/hash';
import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

interface SignInRequest {
  email: string;
  password: string;
}

@Injectable()
export class SignInService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  public async run({ email, password }: SignInRequest) {
    const foundUser = await this.usersRepository.findByEmail(email);

    if (!foundUser) throw new NotFoundException('User not found');

    const passwordMatch = verifyHash(password, foundUser.password);

    if (!passwordMatch) throw new NotFoundException('User not found');

    const payload = { sub: foundUser.id };

    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
    };
  }
}
