import {
  Code,
  CreateCodesInput,
  EditCodesInput,
} from '@app/interfaces/code.interface';

export abstract class CodesRepository {
  abstract create(data: CreateCodesInput): Promise<Code>;
  abstract findByCodeAndUser(code: string, userId: string): Promise<Code>;
  abstract edit(codeId: string, data: EditCodesInput): Promise<void>;
}
