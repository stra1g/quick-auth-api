import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { MailProvider } from 'providers/mail/mail.provider';

type SendMailRequest = {
  from: string;
  to: string;
  subject: string;
  text: string;
  html: string;
};

@Injectable()
export class SendMailService {
  constructor(private readonly mailProvider: MailProvider) {}

  public async run({ from, html, subject, text, to }: SendMailRequest) {
    const info = await this.mailProvider.send({
      from,
      to,
      subject,
      text,
      html,
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  }
}
