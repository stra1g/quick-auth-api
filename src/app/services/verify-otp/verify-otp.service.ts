import { UsersRepository } from '@app/repositories/users.repository';
import { verifyToken } from '@infra/auth/2fa/verify-token';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

interface VerifyOTPRequest {
  userId: string;
  token: string;
}

@Injectable()
export class VerifyOTPService {
  constructor(private readonly usersRepository: UsersRepository) {}

  public async run({ token, userId }: VerifyOTPRequest) {
    const foundUser = await this.usersRepository.findById(userId);

    if (!foundUser) throw new NotFoundException('User not found');

    const isTokenValid = verifyToken(token, foundUser.base32_2fa);

    if (!isTokenValid) throw new BadRequestException('Invalid token');

    return {
      otp_verified: true,
      user_id: foundUser.id,
    };
  }
}
