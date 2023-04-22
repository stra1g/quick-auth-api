import * as nodemailer from 'nodemailer';
import { mailConfigs } from './config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailProvider {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport(mailConfigs.ethereal);
  }

  public async send(options: nodemailer.SendMailOptions) {
    return this.transporter.sendMail(options);
  }
}
