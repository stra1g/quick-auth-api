import { IsEmail, IsString, Matches } from 'class-validator';

export class SignInDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]|\:;"'<>,.?\/])(?=.*\d)[a-zA-Z\d!@#$%^&*()_\-+={}[\]|\:;"'<>,.?\/]{6,}$/,
  )
  password: string;
}
