import { SignInService } from '@app/services/sign-in/sign-in.service';
import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { SignInDto } from '../dtos/sign-in.dto';
import { Response } from 'express';
import { GoogleAuthGuard } from '@infra/auth/guards/google.guard';

@Controller()
export class AuthController {
  constructor(private readonly signInService: SignInService) {}

  @Post('login')
  async create(@Body() body: SignInDto) {
    const { access_token } = await this.signInService.run(body);

    return { access_token };
  }

  @Get('auth/google')
  @UseGuards(GoogleAuthGuard)
  googleLogin(): void {
    // initiates the Google OAuth2 login flow
  }

  @Get('auth/google/callback')
  @UseGuards(GoogleAuthGuard)
  googleLoginCallback(@Req() req: any, @Res() res: Response): void {
    const { user } = req;

    res.json({
      user,
    });
  }
}
