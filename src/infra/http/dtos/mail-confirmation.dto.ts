import { IsEmail, IsString, MaxLength } from 'class-validator';

export class MailConfirmationDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MaxLength(6)
  code: string;
}
