import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { PrismaUsersRepository } from './prisma/repositories/users-prisma.repository';
import { UsersRepository } from '@app/repositories/users.repository';
import { CodesRepository } from '@app/repositories/codes.repository';
import { PrismaCodesRepository } from './prisma/repositories/codes-prisma.repository';

@Module({
  providers: [
    PrismaService,
    {
      provide: UsersRepository,
      useClass: PrismaUsersRepository,
    },
    {
      provide: CodesRepository,
      useClass: PrismaCodesRepository,
    },
  ],
  exports: [UsersRepository, CodesRepository],
})
export class DatabaseModule {}
