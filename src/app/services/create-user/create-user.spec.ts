import { UsersRepository } from '@app/repositories/users.repository';
import { CreateUserService } from './create-user.service';
import { randomUUID } from 'crypto';
import { makeHash } from '@helpers/hash';

type MockUsersRepository = jest.Mocked<UsersRepository>;

describe('Create user service', () => {
  let service: CreateUserService;
  let usersRepository: MockUsersRepository;

  beforeEach(() => {
    usersRepository = {
      create: jest.fn(),
      findByEmail: jest.fn(),
    } as unknown as MockUsersRepository;

    service = new CreateUserService(usersRepository);
  });

  it('should not be able to create a new user with an existing email', async () => {
    const dto = {
      first_name: 'John',
      last_name: 'Doe',
      email: 'existing@mail.com',
      password: 'Aa123456#',
    };

    const findByEmailMethod = jest.spyOn(usersRepository, 'findByEmail');
    usersRepository.findByEmail.mockResolvedValue({
      id: randomUUID(),
      ...dto,
      password: makeHash(dto.password),
      email_verified: false,
      created_at: new Date(),
      ascii_otp: null,
      base32_otp: null,
      is_2fa_enabled: false,
      hex_otp: null,
      otpauth_url_otp: null,
      strategy_2fa: null,
    });

    expect(() => service.run(dto)).rejects.toThrowError();
    expect(findByEmailMethod).toHaveBeenCalled();
  });

  it('should be able to create a new user', async () => {
    const dto = {
      first_name: 'John',
      last_name: 'Doe',
      email: 'johndoe@example.com',
      password: 'Aa123456#',
    };

    usersRepository.findByEmail.mockResolvedValue(undefined);

    const mockUserReturn = {
      id: randomUUID(),
      ...dto,
      password: makeHash(dto.password),
      email_verified: false,
      created_at: new Date(),
      ascii_otp: null,
      base32_otp: null,
      is_2fa_enabled: false,
      hex_otp: null,
      otpauth_url_otp: null,
      strategy_2fa: null,
    };
    const createMethod = jest.spyOn(usersRepository, 'create');
    usersRepository.create.mockResolvedValue(mockUserReturn);

    const { user } = await service.run(dto);

    expect(createMethod).toHaveBeenCalled();
    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('first_name');
    expect(user.first_name).toBe(dto.first_name);
    expect(user).toHaveProperty('last_name');
    expect(user.last_name).toBe(dto.last_name);
    expect(user).toHaveProperty('email');
    expect(user.email).toBe(dto.email);
    expect(user).not.toHaveProperty('password');
    expect(user).not.toHaveProperty('created_at');
  });
});
