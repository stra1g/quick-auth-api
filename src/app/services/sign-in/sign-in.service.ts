import { UsersRepository } from '@app/repositories/users.repository';
import { verifyHash } from '@helpers/hash';
import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SendMailService } from '../send-mail/send-mail.service';

interface SignInRequest {
  email: string;
  password: string;
}

@Injectable()
export class SignInService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
    private readonly sendMailService: SendMailService,
  ) {}

  public async run({ email, password }: SignInRequest) {
    const foundUser = await this.usersRepository.findByEmail(email);

    if (!foundUser) throw new NotFoundException('User not found');

    const passwordMatch = verifyHash(password, foundUser.password);

    if (!passwordMatch) throw new NotFoundException('User not found');

    const payload = { sub: foundUser.id };

    const token = this.jwtService.sign(payload);

    this.sendMailService.run({
      to: foundUser.email,
      subject: 'Welcome to QuickAuth',
      text: 'Welcome to QuickAuth',
      html: '<h1>Welcome to QuickAuth</h1>',
    });

    return {
      access_token: token,
    };
  }
}
