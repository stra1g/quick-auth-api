import { Strategy2FA } from '@app/interfaces/user.interface';
import { UsersRepository } from '@app/repositories/users.repository';
import { encrypt } from '@helpers/encrypt';
import { generate2faSecrets } from '@infra/auth/2fa/generate-2fa-secrets';
import { Injectable } from '@nestjs/common';

interface Enable2FARequest {
  userId: string;
  email: string;
  strategy: Strategy2FA;
}

interface Enable2FAResponse {
  strategy_2fa: Strategy2FA;
  base32_otp?: string;
  otpauth_url_otp?: string;
}

@Injectable()
export class Enable2FAService {
  constructor(private readonly usersRepository: UsersRepository) {}

  public async run({
    email,
    strategy,
    userId,
  }: Enable2FARequest): Promise<Enable2FAResponse> {
    if (strategy === Strategy2FA.EMAIL) {
      await this.usersRepository.edit(userId, {
        is_2fa_enabled: true,
        strategy_2fa: Strategy2FA.EMAIL,
      });

      return {
        strategy_2fa: Strategy2FA.EMAIL,
      };
    }

    if (strategy === Strategy2FA.OTP) {
      const { ascii, base32, hex, otpauth_url } = await generate2faSecrets(
        email,
      );

      await this.usersRepository.edit(userId, {
        ascii_otp: encrypt(ascii, process.env.BASE_32_OTP_ENCRYPTION_KEY),
        base32_otp: encrypt(base32, process.env.BASE_32_OTP_ENCRYPTION_KEY),
        hex_otp: encrypt(hex, process.env.BASE_32_OTP_ENCRYPTION_KEY),
        otpauth_url_otp: otpauth_url,
        is_2fa_enabled: true,
      });

      return {
        strategy_2fa: Strategy2FA.OTP,
        base32_otp: base32,
        otpauth_url_otp: otpauth_url,
      };
    }
  }
}
