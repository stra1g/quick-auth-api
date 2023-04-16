import { makeHash } from '@helpers/hash';
import { Replace } from '@helpers/Replace';
import { randomUUID } from 'crypto';

export interface UserProps {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  created_at: Date;
}

export class User {
  private _id: string;
  private props: UserProps;

  constructor(props: Replace<UserProps, { created_at?: Date }>) {
    const isEmailValid = this.validateMail(props.email);

    if (!isEmailValid) throw new Error('Invalid email');

    const isPasswordValid = this.validatePassword(props.password);

    if (!isPasswordValid) throw new Error('Invalid password');

    this._id = randomUUID();
    this.props = {
      ...props,
      password: makeHash(props.password),
      created_at: props.created_at ?? new Date(),
    };
  }

  public get id(): string {
    return this._id;
  }

  public get first_name(): string {
    return this.props.first_name;
  }

  public set first_name(first_name: string) {
    this.props.first_name = first_name;
  }

  public get last_name(): string {
    return this.props.last_name;
  }

  public set last_name(last_name: string) {
    this.props.last_name = last_name;
  }

  public get email(): string {
    return this.props.email;
  }

  public set email(email: string) {
    const isValid = this.validateMail(email);

    if (!isValid) throw new Error('Invalid email');

    this.props.email = email;
  }

  private validateMail(email: string) {
    /** apply regex to validate email before store */
    const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    return regex.test(email);
  }

  public get password(): string {
    return this.props.password;
  }

  public set password(password: string) {
    const isValid = this.validatePassword(password);

    if (!isValid) throw new Error('Invalid password');

    const hashedPassword = makeHash(password);
    this.props.password = password;
  }

  private validatePassword(password: string) {
    /** apply regex to validate password before store
      at least one lowercase letter
      at least one uppercase letter
      at least 6 characters long
      at least one number
      at least one special character
    */
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]|\:;"'<>,.?\/])(?=.*\d)[a-zA-Z\d!@#$%^&*()_\-+={}[\]|\:;"'<>,.?\/]{6,}$/;
    return regex.test(password);
  }

  public get created_at(): Date {
    return this.props.created_at;
  }
}
