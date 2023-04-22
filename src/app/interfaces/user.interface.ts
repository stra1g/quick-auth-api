export type User = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  email_verified: boolean;
  created_at: Date;
};

export type CreateUsersInput = Omit<
  User,
  'id' | 'created_at' | 'email_verified'
>;

export type UsersOutputWithoutSensitive = Omit<User, 'password' | 'created_at'>;

export type EditUsersInput = Partial<
  Pick<User, 'email_verified' | 'first_name' | 'last_name'>
>;
