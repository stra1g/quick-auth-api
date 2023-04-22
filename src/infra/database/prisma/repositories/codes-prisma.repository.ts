import { PrismaService } from '../prisma.service';
import { Injectable } from '@nestjs/common';
import { CodesRepository } from '@app/repositories/codes.repository';
import {
  Code,
  CreateCodesInput,
  EditCodesInput,
} from '@app/interfaces/code.interface';

@Injectable()
export class PrismaCodesRepository implements CodesRepository {
  constructor(private prismaService: PrismaService) {}

  async create(data: CreateCodesInput): Promise<Code> {
    return this.prismaService.code.create({
      data,
    });
  }

  async findByCodeAndUser(code: string, userId: string): Promise<Code> {
    return this.prismaService.code.findFirst({
      where: {
        code,
        user_id: userId,
      },
    });
  }

  async edit(codeId: string, data: EditCodesInput): Promise<void> {
    await this.prismaService.code.update({
      data,
      where: {
        id: codeId,
      },
    });
  }
}
