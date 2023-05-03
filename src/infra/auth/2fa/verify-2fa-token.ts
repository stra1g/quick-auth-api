import * as speakeasy from 'speakeasy';

export const verifyToken = (
  token: string,
  base32String: string,
  window?: number,
) => {
  return speakeasy.totp.verify({
    secret: base32String,
    encoding: 'base32',
    token,
    window: window || 0,
  });
};
