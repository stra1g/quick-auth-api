import { Module } from '@nestjs/common';
import { MailProvider } from './mail.provider';
import { IMailProvider } from './mail.interface';

@Module({
  providers: [
    {
      provide: IMailProvider,
      useClass: MailProvider,
    },
  ],
  exports: [IMailProvider],
})
export class MailModule {}
