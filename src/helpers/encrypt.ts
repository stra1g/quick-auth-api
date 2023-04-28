import { randomBytes, createCipheriv, createDecipheriv } from 'node:crypto';

export const encrypt = (plainText: string, encryptionKey: string): string => {
  const iv = randomBytes(16);
  const cipher = createCipheriv('aes-256-cbc', Buffer.from(encryptionKey), iv);
  const encrypted =
    cipher.update(plainText, 'utf8', 'hex') + cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
};

export const decrypt = (cipherText: string, encryptionKey: string): string => {
  const parts = cipherText.split(':');
  const iv = Buffer.from(parts.shift(), 'hex');
  const encrypted = parts.join(':');
  const decipher = createDecipheriv(
    'aes-256-cbc',
    Buffer.from(encryptionKey),
    iv,
  );
  const decrypted =
    decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8');
  return decrypted;
};
