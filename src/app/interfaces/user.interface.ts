export type User = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  created_at: Date;
};

export type CreateUsersInput = Omit<User, 'id' | 'created_at'>;

export type UsersOutputWithoutSensitive = Omit<User, 'password' | 'created_at'>;
