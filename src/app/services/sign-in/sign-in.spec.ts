import { UsersRepository } from '@app/repositories/users.repository';
import { SignInService } from './sign-in.service';
import { JwtService } from '@nestjs/jwt';
import { NotFoundException } from '@nestjs/common';
import { randomBytes, randomUUID } from 'crypto';
import { makeHash } from '@helpers/hash';

type MockUsersRepository = jest.Mocked<UsersRepository>;
type MockJwtService = jest.Mocked<JwtService>;

describe('Sign in service', () => {
  let usersRepository: MockUsersRepository;
  let jwtService: MockJwtService;
  let service: SignInService;

  beforeEach(() => {
    usersRepository = {
      findByEmail: jest.fn(),
    } as unknown as MockUsersRepository;
    jwtService = {
      sign: jest.fn(),
    } as unknown as MockJwtService;

    service = new SignInService(usersRepository, jwtService);
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
      first_name: 'Tester',
      last_name: 'Test',
      created_at: new Date(),
    });

    expect(() =>
      service.run({
        email,
        password: 'AAaa1234#',
      }),
    ).rejects.toThrow(new NotFoundException('User not found'));
  });

  it('should be able to sign in', async () => {
    const password = 'AAaa123456#';
    const email = 'tester@test.com';
    usersRepository.findByEmail.mockResolvedValue({
      id: randomUUID(),
      email,
      password: makeHash(password),
      first_name: 'Tester',
      last_name: 'Test',
      created_at: new Date(),
    });
    jwtService.sign.mockReturnValue(randomBytes(16).toString('hex'));

    const { access_token } = await service.run({ email, password });

    expect(access_token).toBeTruthy();
    expect(typeof access_token).toBe('string');
  });
});
