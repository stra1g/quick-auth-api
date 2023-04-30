import { UsersRepository } from '@app/repositories/users.repository';
import { Enable2FAService } from './enable-2fa.service';
import { randomUUID } from 'crypto';
import { Strategy2FA } from '@app/interfaces/user.interface';

type MockUsersRepository = jest.Mocked<UsersRepository>;

describe('Enable 2fa service', () => {
  let usersRepository: MockUsersRepository;
  let service: Enable2FAService;

  beforeEach(() => {
    usersRepository = {
      edit: jest.fn(),
    } as unknown as MockUsersRepository;

    service = new Enable2FAService(usersRepository);
  });

  it('should be able to enable 2fa service with email strategy', async () => {
    const userId = randomUUID();
    const email = 'user@email.com';

    const { strategy_2fa } = await service.run({
      email,
      strategy: Strategy2FA.EMAIL,
      userId,
    });

    expect(strategy_2fa).toBe(Strategy2FA.EMAIL);
  });

  it('should be able to enable 2fa service with otp strategy', async () => {
    const userId = randomUUID();
    const email = 'user@email.com';

    const { strategy_2fa, base32_otp, otpauth_url_otp } = await service.run({
      email,
      strategy: Strategy2FA.OTP,
      userId,
    });

    expect(strategy_2fa).toBe(Strategy2FA.OTP);
    expect(base32_otp).not.toBeUndefined();
    expect(otpauth_url_otp).not.toBeUndefined();
  });
});
