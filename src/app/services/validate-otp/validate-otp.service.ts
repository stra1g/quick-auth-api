import { UsersRepository } from '@app/repositories/users.repository';
import { verifyToken } from '@infra/auth/2fa/verify-2fa-token';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SendMailService } from '../send-mail/send-mail.service';

interface ValidateOTPRequest {
  userId: string;
  token: string;
}

@Injectable()
export class ValidateOTPService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
    private readonly sendMailService: SendMailService,
  ) {}

  public async run({ token, userId }: ValidateOTPRequest) {
    const foundUser = await this.usersRepository.findById(userId);

    if (!foundUser) throw new NotFoundException('User not found');

    const isTokenValid = verifyToken(token, foundUser.base32_otp, 1);

    if (!isTokenValid) throw new BadRequestException('Invalid token');

    const payload = { sub: foundUser.id };
    const access_token = this.jwtService.sign(payload);

    this.sendMailService.run({
      to: foundUser.email,
      subject: 'New login activity',
      text: 'New login activity',
      view: 'new_login_activity.ejs',
      viewOptions: {
        name: foundUser.first_name,
      },
    });

    return {
      otp_verified: true,
      data: { access_token },
    };
  }
}
