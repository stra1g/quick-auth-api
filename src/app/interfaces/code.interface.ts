export type Code = {
  id: string;
  user_id: string;
  code: string;
  used: boolean;
  used_at: Date;
  expires_at: Date;
  created_at: Date;
};

export type CreateCodesInput = Pick<Code, 'user_id' | 'expires_at' | 'code'>;
export type EditCodesInput = Partial<Pick<Code, 'used' | 'used_at'>>;
