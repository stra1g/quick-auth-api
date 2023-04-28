import { UsersRepository } from '@app/repositories/users.repository';
import { verifyHash } from '@helpers/hash';
import { Injectable, NotFoundException } from '@nestjs/common';
import { SendMailService } from '../send-mail/send-mail.service';
import { CodesRepository } from '@app/repositories/codes.repository';
import { JwtService } from '@nestjs/jwt';
import { generate2faSecrets } from '@infra/auth/2fa/generate-2fa-secrets';

interface SignInRequest {
  email: string;
  password: string;
}

interface SignIn2faResponse {
  base_32_2fa?: string;
  otpauth_url_2fa?: string;
}

interface SignInAccessTokenResponse {
  access_token: string;
}

interface SignInResponse {
  is_2fa_enabled: boolean;
  is_email_verified: boolean;
  data:
    | SignIn2faResponse
    | SignInAccessTokenResponse
    | { mail_verification_required: boolean };
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
  }: SignInRequest): Promise<SignInResponse> {
    const foundUser = await this.usersRepository.findByEmail(email);

    if (!foundUser) throw new NotFoundException('User not found');

    const passwordMatch = verifyHash(password, foundUser.password);

    if (!passwordMatch) throw new NotFoundException('User not found');

    if (!foundUser.email_verified) {
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

      return {
        is_2fa_enabled: false,
        is_email_verified: false,
        data: {
          mail_verification_required: true,
        },
      };
    }

    if (foundUser.is_2fa_enabled) {
      const { ascii, base32, hex, otpauth_url } = await generate2faSecrets(
        foundUser.email,
      );

      await this.usersRepository.edit(foundUser.id, {
        ascii_2fa: ascii,
        base32_2fa: base32,
        hex_2fa: hex,
        otpauth_url_2fa: otpauth_url,
      });

      return {
        is_2fa_enabled: true,
        is_email_verified: true,
        data: { base_32_2fa: base32, otpauth_url_2fa: otpauth_url },
      };
    }

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
      is_2fa_enabled: false,
      is_email_verified: true,
      data: { access_token },
    };
  }
}
