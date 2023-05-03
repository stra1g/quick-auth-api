import { UsersRepository } from '@app/repositories/users.repository';
import { PrismaService } from '../prisma.service';
import { Injectable } from '@nestjs/common';
import {
  CreateUsersInput,
  EditUsersInput,
} from '@app/interfaces/user.interface';
import { User } from '@prisma/client';

@Injectable()
export class PrismaUsersRepository implements UsersRepository {
  constructor(private prismaService: PrismaService) {}

  async create(data: CreateUsersInput): Promise<User> {
    return this.prismaService.user.create({
      data,
    });
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.prismaService.user.findFirst({
      where: {
        email,
      },
    });
  }

  async findById(id: string): Promise<User | undefined> {
    return this.prismaService.user.findUnique({
      where: {
        id,
      },
    });
  }

  async edit(userId: string, data: EditUsersInput): Promise<void> {
    await this.prismaService.user.update({
      data,
      where: {
        id: userId,
      },
    });
  }
}
