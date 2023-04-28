-- AlterTable
ALTER TABLE "User" ADD COLUMN     "ascii_2fa" TEXT,
ADD COLUMN     "base32_2fa" TEXT,
ADD COLUMN     "hex_2fa" TEXT,
ADD COLUMN     "is_2fa_enabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "otpauth_url_2fa" TEXT;
