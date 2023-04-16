import { SignInService } from '@app/services/sign-in/sign-in.service';
import { Body, Controller, Post } from '@nestjs/common';
import { SignInDto } from '../dtos/sign-in.dto';

@Controller()
export class AuthController {
  constructor(private readonly signInService: SignInService) {}

  @Post('login')
  async create(@Body() body: SignInDto) {
    const { access_token } = await this.signInService.run(body);

    return { access_token };
  }
}
