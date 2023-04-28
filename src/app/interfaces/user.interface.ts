export type User = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  email_verified: boolean;
  created_at: Date;
  is_2fa_enabled: boolean;
  strategy_2fa: 'otp' | 'email' | null;
  ascii_otp: string | null;
  hex_otp: string | null;
  base32_otp: string | null;
  otpauth_url_otp: string | null;
};

export type CreateUsersInput = Pick<
  User,
  'first_name' | 'last_name' | 'email' | 'password'
>;

export enum Strategy2FA {
  OTP = 'otp',
  EMAIL = 'email',
}

export type UsersOutputWithoutSensitive = Omit<User, 'password' | 'created_at'>;

export type EditUsersInput = Partial<
  Pick<
    User,
    | 'email_verified'
    | 'first_name'
    | 'last_name'
    | 'is_2fa_enabled'
    | 'strategy_2fa'
    | 'ascii_otp'
    | 'hex_otp'
    | 'base32_otp'
    | 'otpauth_url_otp'
  >
>;
