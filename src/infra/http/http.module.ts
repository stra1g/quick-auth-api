import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { UsersController } from './controllers/users.controller';
import { CreateUserService } from '@app/services/create-user/create-user.service';

@Module({
  imports: [DatabaseModule],
  controllers: [UsersController],
  providers: [CreateUserService],
})
export class HttpModule {}
