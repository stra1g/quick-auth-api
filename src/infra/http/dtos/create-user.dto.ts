import { IsEmail, IsString, Matches } from 'class-validator';

export class CreateUserDto {
  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]|\:;"'<>,.?\/])(?=.*\d)[a-zA-Z\d!@#$%^&*()_\-+={}[\]|\:;"'<>,.?\/]{6,}$/,
  )
  password: string;
}
