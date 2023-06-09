import { UsersRepository } from '@app/repositories/users.repository';
import { SignInService } from './sign-in.service';
import { JwtService } from '@nestjs/jwt';
import { NotFoundException } from '@nestjs/common';
import { randomBytes, randomUUID } from 'crypto';
import { makeHash } from '@helpers/hash';
import { CodesRepository } from '@app/repositories/codes.repository';
import { SendMailService } from '../send-mail/send-mail.service';

type MockUsersRepository = jest.Mocked<UsersRepository>;
type MockCodesRepository = jest.Mocked<CodesRepository>;
type MockJwtService = jest.Mocked<JwtService>;
type MockSendMailService = jest.Mocked<SendMailService>;

describe('Sign in service', () => {
  let usersRepository: MockUsersRepository;
  let codesRepository: MockCodesRepository;
  let jwtService: MockJwtService;
  let sendMailService: MockSendMailService;
  let service: SignInService;

  beforeEach(() => {
    usersRepository = {
      findByEmail: jest.fn(),
    } as unknown as MockUsersRepository;
    codesRepository = {
      create: jest.fn(),
    } as unknown as MockCodesRepository;
    jwtService = {
      sign: jest.fn(),
    } as unknown as MockJwtService;
    sendMailService = {
      run: jest.fn(),
    } as unknown as MockSendMailService;

    service = new SignInService(
      usersRepository,
      codesRepository,
      jwtService,
      sendMailService,
    );
  });

  it('should not be able to sign in with a non existing user', async () => {
    usersRepository.findByEmail.mockResolvedValue(undefined);
    expect(() =>
      service.run({
        email: 'nonexisting@mail.com',
        password: 'AAaa1234#',
      }),
    ).rejects.toThrow(new NotFoundException('User not found'));
  });

  it('should not be able to sign in with wrong password', async () => {
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

    expect(() =>
      service.run({
        email,
        password: 'AAaa1234#',
      }),
    ).rejects.toThrow(new NotFoundException('User not found'));
  });

  it('should not be able to sign in if email is not verified', async () => {
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
    jest.spyOn(codesRepository, 'create');
    jest.spyOn(sendMailService, 'run');
    jwtService.sign.mockReturnValue(randomBytes(16).toString('hex'));

    const { data, is_2fa_enabled, is_email_verified } = await service.run({
      email,
      password,
    });

    expect(is_2fa_enabled).toBeFalsy();
    expect(is_email_verified).toBeFalsy();
    expect(data).toHaveProperty('mail_verification_required');
    expect(codesRepository.create).toBeCalledTimes(1);
    expect(sendMailService.run).toBeCalledTimes(1);
  });

  it('should be able to sign in if email is already verified and 2fa is not enabled', async () => {
    const password = 'AAaa123456#';
    const email = 'tester@test.com';
    usersRepository.findByEmail.mockResolvedValue({
      id: randomUUID(),
      email,
      password: makeHash(password),
      email_verified: true,
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
    jwtService.sign.mockReturnValue(randomBytes(16).toString('hex'));

    const { data, is_2fa_enabled, is_email_verified } = await service.run({
      email,
      password,
    });

    expect(is_2fa_enabled).toBeFalsy();
    expect(is_email_verified).toBeTruthy();
    expect(data).toHaveProperty('access_token');
  });
});
