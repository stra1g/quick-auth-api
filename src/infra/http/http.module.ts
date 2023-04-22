import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { UsersController } from './controllers/users.controller';
import { CreateUserService } from '@app/services/create-user/create-user.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '@infra/auth/strategies/jwt.strategy';
import { SignInService } from '@app/services/sign-in/sign-in.service';
import { AuthController } from './controllers/auth.controller';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from '@infra/auth/strategies/google.strategy';
import { GoogleSignInService } from '@app/services/google-sign-in/google-sign-in.service';
import { SendMailService } from '@app/services/send-mail/send-mail.service';
import { MailModule } from 'providers/mail/mail.module';
import { MailConfirmationService } from '@app/services/mail-confirmation/mail-confirmation.service';

@Module({
  imports: [
    DatabaseModule,
    JwtModule.register({
      secret: process.env.JWT_SECREY_KEY,
      signOptions: {
        expiresIn: '300s', // 5 minutes
      },
    }),
    PassportModule.register({
      session: true,
    }),
    MailModule,
  ],
  controllers: [UsersController, AuthController],
  providers: [
    CreateUserService,
    SignInService,
    JwtStrategy,
    GoogleStrategy,
    GoogleSignInService,
    SendMailService,
    MailConfirmationService,
  ],
})
export class HttpModule {}
