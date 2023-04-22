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
import { Request, Response } from 'express';
import { GoogleAuthGuard } from '@infra/auth/guards/google.guard';
import { GoogleSignInService } from '@app/services/google-sign-in/google-sign-in.service';
import { MailConfirmationDto } from '../dtos/mail-confirmation.dto';
import { MailConfirmationService } from '@app/services/mail-confirmation/mail-confirmation.service';

type GoogleCallbackRequest = Request & {
  user: {
    first_name: string;
    last_name: string;
    email: string;
    picture: string;
    access_token: string;
    refresh_token?: string;
  };
};

@Controller('auth')
export class AuthController {
  constructor(
    private readonly signInService: SignInService,
    private readonly mailConfirmationService: MailConfirmationService,
    private readonly googleSignInService: GoogleSignInService,
  ) {}

  @Post('login')
  async create(@Body() body: SignInDto, response: Response) {
    const responseData = await this.signInService.run(body);

    if (responseData.access_token)
      return response.json({
        access_token: responseData.access_token,
      });

    return response.json({
      message: 'Verification code sent to email',
    });
  }

  @Post('mail/confirmation')
  async confirmMail(@Body() body: MailConfirmationDto, response: Response) {
    const { access_token } = await this.mailConfirmationService.run(body);

    return response.json({
      access_token,
    });
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  googleLogin(): void {
    // initiates the Google OAuth2 login flow
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleLoginCallback(
    @Req() req: GoogleCallbackRequest,
    @Res() res: Response,
  ): Promise<void> {
    const { user } = req;

    const { access_token } = await this.googleSignInService.run({
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
    });

    res.json({
      access_token,
    });
  }
}
