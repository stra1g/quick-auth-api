import * as speakeasy from 'speakeasy';

export const verifyToken = (token: string, base32String: string) => {
  return speakeasy.totp.verify({
    secret: base32String,
    encoding: 'base32',
    token,
  });
};
