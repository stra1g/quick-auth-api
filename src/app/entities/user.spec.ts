import { User } from './user.entity';

describe('User entity', () => {
  it('should not be able to create a user if email is invalid', () => {
    expect(
      () =>
        new User({
          email: 'invalid_email',
          first_name: 'Test',
          last_name: 'Name',
          password: 'AaBb12345#',
        }),
    ).toThrowError('Invalid email');
  });

  it('should not be able to create a user if password has less than 6 characters', () => {
    expect(
      () =>
        new User({
          email: 'tester@test.com',
          first_name: 'Test',
          last_name: 'Name',
          password: '12345',
        }),
    ).toThrowError('Invalid password');
  });

  it('should not be able to create a user if password has only uppercase letters', () => {
    expect(
      () =>
        new User({
          email: 'tester@test.com',
          first_name: 'Test',
          last_name: 'Name',
          password: 'AAAAAAA',
        }),
    ).toThrowError('Invalid password');
  });

  it('should not be able to create a user if password has only lowercase letters', () => {
    expect(
      () =>
        new User({
          email: 'tester@test.com',
          first_name: 'Test',
          last_name: 'Name',
          password: 'aaaaaa',
        }),
    ).toThrowError('Invalid password');
  });

  it('should not be able to create a user if password has no numbers ', () => {
    expect(
      () =>
        new User({
          email: 'tester@test.com',
          first_name: 'Test',
          last_name: 'Name',
          password: 'AAaaAA',
        }),
    ).toThrowError('Invalid password');
  });

  it('should not be able to create a user if password has no special characters ', () => {
    expect(
      () =>
        new User({
          email: 'tester@test.com',
          first_name: 'Test',
          last_name: 'Name',
          password: 'AAaaAA123',
        }),
    ).toThrowError('Invalid password');
  });

  it('should be able to create a user', () => {
    const dto = {
      email: 'tester@test.com',
      first_name: 'Test',
      last_name: 'Name',
      password: 'AAaa123#',
    };
    const user = new User(dto);

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
