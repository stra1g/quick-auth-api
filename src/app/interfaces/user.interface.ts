export type User = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  email_verified: boolean;
  created_at: Date;
  is_2fa_enabled: boolean;
  ascii_2fa: string | null;
  hex_2fa: string | null;
  base32_2fa: string | null;
  otpauth_url_2fa: string | null;
};

export type CreateUsersInput = Pick<
  User,
  'first_name' | 'last_name' | 'email' | 'password'
>;

export type UsersOutputWithoutSensitive = Omit<User, 'password' | 'created_at'>;

export type EditUsersInput = Partial<
  Pick<
    User,
    | 'email_verified'
    | 'first_name'
    | 'last_name'
    | 'is_2fa_enabled'
    | 'ascii_2fa'
    | 'hex_2fa'
    | 'base32_2fa'
    | 'otpauth_url_2fa'
  >
>;
