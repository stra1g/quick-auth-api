import { UsersRepository } from '@app/repositories/users.repository';
import { CreateUserService } from './create-user.service';

type MockUsersRepository = UsersRepository & { create: jest.Mock };

describe('Create user service', () => {
  let service: CreateUserService;
  let usersRepository: MockUsersRepository;

  beforeEach(() => {
    usersRepository = {
      create: jest.fn(),
    } as unknown as MockUsersRepository;

    service = new CreateUserService(usersRepository);
  });

  it('should be able to create a new user', async () => {
    const dto = {
      first_name: 'John',
      last_name: 'Doe',
      email: 'johndoe@example.com',
      password: 'Aa123456#',
    };

    const createMethod = jest.spyOn(usersRepository, 'create');
    usersRepository.create.mockResolvedValue(undefined);

    const { user } = await service.run(dto);

    expect(createMethod).toHaveBeenCalled();
    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('first_name');
    expect(user.first_name).toBe(dto.first_name);
    expect(user).toHaveProperty('last_name');
    expect(user.last_name).toBe(dto.last_name);
    expect(user).toHaveProperty('email');
    expect(user.email).toBe(dto.email);
    expect(user).toHaveProperty('password');
    expect(user.password).not.toBe(dto.password); // password must be hashed
    expect(user).toHaveProperty('created_at');
    expect(user.created_at).toBeInstanceOf(Date);
  });
});
