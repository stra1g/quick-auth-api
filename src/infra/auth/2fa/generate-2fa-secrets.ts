import * as speakeasy from 'speakeasy';

export const generate2faSecrets = async (name: string) => {
  return speakeasy.generateSecret({
    issuer: 'codevoweb.com',
    name,
    length: 15,
  });
};
