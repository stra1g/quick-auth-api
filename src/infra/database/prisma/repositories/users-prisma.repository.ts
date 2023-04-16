import { UsersRepository } from 'app/repositories/users.repository';
import { PrismaService } from '../prisma.service';
import { Injectable } from '@nestjs/common';
import { User } from '@app/entities/user.entity';

@Injectable()
export class PrismaUsersRepository implements UsersRepository {
  constructor(private prismaService: PrismaService) {}

  async create(user: User): Promise<void> {
    await this.prismaService.user.create({
      data: user,
    });
  }
}
