import { Injectable } from '@nestjs/common';
import { IMailProvider } from 'providers/mail/mail.interface';
import * as ejs from 'ejs';
import { join } from 'path';

type SendMailRequest = {
  from?: string;
  to: string;
  subject: string;
  text: string;
  rawHtml?: string;
  view?: string;
  viewOptions?: Record<string, unknown>;
};

@Injectable()
export class SendMailService {
  constructor(private readonly mailProvider: IMailProvider) {}

  public async run({
    from,
    rawHtml,
    subject,
    text,
    to,
    view,
    viewOptions,
  }: SendMailRequest) {
    const html =
      rawHtml ??
      (await ejs.renderFile(
        join(process.cwd(), 'src', 'templates', view),
        viewOptions,
      ));

    await this.mailProvider.send({
      from: from ?? `${process.env.SENDER_NAME} <${process.env.SENDER_EMAIL}>`,
      to,
      subject,
      text,
      html,
    });
  }
}
