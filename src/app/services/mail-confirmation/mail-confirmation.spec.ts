import { UsersRepository } from '@app/repositories/users.repository';
import { MailConfirmationService } from './mail-confirmation.service';
import { JwtService } from '@nestjs/jwt';
import { NotFoundException } from '@nestjs/common';
import { randomBytes, randomUUID } from 'crypto';
import { makeHash } from '@helpers/hash';
import { CodesRepository } from '@app/repositories/codes.repository';

type MockUsersRepository = jest.Mocked<UsersRepository>;
type MockCodesRepository = jest.Mocked<CodesRepository>;
type MockJwtService = jest.Mocked<JwtService>;

describe('Mail confirmation service', () => {
  let usersRepository: MockUsersRepository;
  let codesRepository: MockCodesRepository;
  let jwtService: MockJwtService;
  let service: MailConfirmationService;

  beforeEach(() => {
    usersRepository = {
      findByEmail: jest.fn(),
      edit: jest.fn(),
    } as unknown as MockUsersRepository;
    codesRepository = {
      findByCodeAndUser: jest.fn(),
      edit: jest.fn(),
    } as unknown as MockCodesRepository;
    jwtService = {
      sign: jest.fn(),
    } as unknown as MockJwtService;

    service = new MailConfirmationService(
      usersRepository,
      codesRepository,
      jwtService,
    );
  });

  it('should not be able to confirm mail if user does not exists', async () => {
    usersRepository.findByEmail.mockResolvedValue(undefined);
    expect(() =>
      service.run({
        email: 'nonexisting@mail.com',
        code: '123456',
      }),
    ).rejects.toThrow(new NotFoundException('User not found'));
  });

  it('should not be able to confirm mail if code does not exists to the user', async () => {
    const password = 'AAaa123456#';
    const email = 'tester@test.com';
    usersRepository.findByEmail.mockResolvedValue({
      id: randomUUID(),
      email,
      password: makeHash(password),
      email_verified: false,
      first_name: 'Tester',
      last_name: 'Test',
      created_at: new Date(),
      ascii_otp: null,
      base32_otp: null,
      is_2fa_enabled: false,
      hex_otp: null,
      otpauth_url_otp: null,
      strategy_2fa: null,
    });
    codesRepository.findByCodeAndUser.mockResolvedValue(undefined);

    expect(() =>
      service.run({
        email,
        code: '123456',
      }),
    ).rejects.toThrow(new NotFoundException('Code not found'));
  });

  it('should not be able to confirm mail if expires_at of code has been reeched', async () => {
    const password = 'AAaa123456#';
    const email = 'tester@test.com';
    const userId = randomUUID();
    usersRepository.findByEmail.mockResolvedValue({
      id: userId,
      email,
      password: makeHash(password),
      email_verified: false,
      first_name: 'Tester',
      last_name: 'Test',
      created_at: new Date(),
      ascii_otp: null,
      base32_otp: null,
      is_2fa_enabled: false,
      hex_otp: null,
      otpauth_url_otp: null,
      strategy_2fa: null,
    });
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    codesRepository.findByCodeAndUser.mockResolvedValue({
      id: randomUUID(),
      code: '123456',
      expires_at: thirtyMinutesAgo,
      user_id: userId,
      used: false,
      used_at: null,
      created_at: new Date(),
    });

    expect(() =>
      service.run({
        code: '123456',
        email,
      }),
    ).rejects.toThrowError('Code expired');
  });

  it('should not be able to confirm mail if code has been used before', async () => {
    const password = 'AAaa123456#';
    const email = 'tester@test.com';
    const userId = randomUUID();
    usersRepository.findByEmail.mockResolvedValue({
      id: userId,
      email,
      password: makeHash(password),
      email_verified: false,
      first_name: 'Tester',
      last_name: 'Test',
      created_at: new Date(),
      ascii_otp: null,
      base32_otp: null,
      is_2fa_enabled: false,
      hex_otp: null,
      otpauth_url_otp: null,
      strategy_2fa: null,
    });
    const thirtyMinutesAfter = new Date(Date.now() + 30 * 60 * 1000);
    codesRepository.findByCodeAndUser.mockResolvedValue({
      id: randomUUID(),
      code: '123456',
      expires_at: thirtyMinutesAfter,
      user_id: userId,
      used: true,
      used_at: new Date(),
      created_at: new Date(),
    });

    expect(() =>
      service.run({
        code: '123456',
        email,
      }),
    ).rejects.toThrowError('Code already used');
  });

  it('should be able to confirm mail', async () => {
    const password = 'AAaa123456#';
    const email = 'tester@test.com';
    const userId = randomUUID();
    usersRepository.findByEmail.mockResolvedValue({
      id: userId,
      email,
      password: makeHash(password),
      email_verified: false,
      first_name: 'Tester',
      last_name: 'Test',
      created_at: new Date(),
      ascii_otp: null,
      base32_otp: null,
      is_2fa_enabled: false,
      hex_otp: null,
      otpauth_url_otp: null,
      strategy_2fa: null,
    });
    const thirtyMinutesAfter = new Date(Date.now() + 30 * 60 * 1000);
    codesRepository.findByCodeAndUser.mockResolvedValue({
      id: randomUUID(),
      code: '123456',
      expires_at: thirtyMinutesAfter,
      user_id: userId,
      used: false,
      used_at: new Date(),
      created_at: new Date(),
    });
    codesRepository.edit.mockResolvedValue(undefined);
    usersRepository.edit.mockResolvedValue(undefined);
    jwtService.sign.mockReturnValue(randomBytes(16).toString('hex'));

    jest.spyOn(codesRepository, 'edit');
    jest.spyOn(usersRepository, 'edit');

    const { access_token } = await service.run({
      email,
      code: '123456',
    });

    expect(access_token).toBeDefined();
    expect(typeof access_token).toBe('string');
    expect(codesRepository.edit).toBeCalledTimes(1);
    expect(usersRepository.edit).toBeCalledTimes(1);
  });
});
