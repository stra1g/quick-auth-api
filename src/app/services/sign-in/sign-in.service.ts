import { UsersRepository } from '@app/repositories/users.repository';
import { verifyHash } from '@helpers/hash';
import { Injectable, NotFoundException } from '@nestjs/common';
import { SendMailService } from '../send-mail/send-mail.service';
import { CodesRepository } from '@app/repositories/codes.repository';
import { JwtService } from '@nestjs/jwt';

interface SignInRequest {
  email: string;
  password: string;
}

interface SignInResponse {
  access_token: string;
}

@Injectable()
export class SignInService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly codesRepository: CodesRepository,
    private readonly jwtService: JwtService,
    private readonly sendMailService: SendMailService,
  ) {}

  public async run({
    email,
    password,
  }: SignInRequest): Promise<SignInResponse | undefined> {
    const foundUser = await this.usersRepository.findByEmail(email);

    if (!foundUser) throw new NotFoundException('User not found');

    const passwordMatch = verifyHash(password, foundUser.password);

    if (!passwordMatch) throw new NotFoundException('User not found');

    if (foundUser.email_verified) {
      const payload = { sub: foundUser.id };
      const access_token = this.jwtService.sign(payload);

      return { access_token };
    }
    // generate a 6 digit random number
    const code = String(Math.floor(100000 + Math.random() * 900000));

    // generate a 15 minute expiration date
    const expiresAt = new Date(Date.now() + 1000 * 60 * 15);

    await this.codesRepository.create({
      code,
      user_id: foundUser.id,
      expires_at: expiresAt,
    });

    this.sendMailService.run({
      to: foundUser.email,
      subject: 'Welcome to QuickAuth',
      text: 'Welcome to QuickAuth',
      view: 'confirm_email.ejs',
      viewOptions: {
        verificationCode: code,
        name: foundUser.first_name,
      },
    });

    return undefined;
  }
}
