import { CodesRepository } from '@app/repositories/codes.repository';
import { UsersRepository } from '@app/repositories/users.repository';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

type MailConfirmationRequest = {
  email: string;
  code: string;
};

@Injectable()
export class MailConfirmationService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly codesRepository: CodesRepository,
    private readonly jwtService: JwtService,
  ) {}

  public async run({ code, email }: MailConfirmationRequest) {
    const foundUser = await this.usersRepository.findByEmail(email);

    if (!foundUser) throw new NotFoundException('User not found');

    const foundCode = await this.codesRepository.findByCodeAndUser(
      code,
      foundUser.id,
    );

    if (!foundCode) throw new NotFoundException('Code not found');

    if (foundCode.expires_at < new Date())
      throw new BadRequestException('Code expired');

    await this.codesRepository.edit(foundCode.id, {
      used: true,
      used_at: new Date(),
    });

    await this.usersRepository.edit(foundUser.id, {
      email_verified: true,
    });

    const payload = { sub: foundUser.id };

    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
    };
  }
}
