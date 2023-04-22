import { Injectable } from '@nestjs/common';
import { IMailProvider } from 'providers/mail/mail.interface';

type SendMailRequest = {
  from: string;
  to: string;
  subject: string;
  text: string;
  html: string;
};

@Injectable()
export class SendMailService {
  constructor(private readonly mailProvider: IMailProvider) {}

  public async run({ from, html, subject, text, to }: SendMailRequest) {
    await this.mailProvider.send({
      from,
      to,
      subject,
      text,
      html,
    });
  }
}
