import * as nodemailer from 'nodemailer';

export abstract class IMailProvider {
  abstract send(options: nodemailer.SendMailOptions): Promise<any>;
}
