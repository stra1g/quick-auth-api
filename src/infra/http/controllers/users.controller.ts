import { CreateUserService } from '@app/services/create-user/create-user.service';
import { CreateUserDto } from '@infra/http/dtos/create-user.dto';
import { Body, Controller, Post } from '@nestjs/common';

@Controller('users')
export class UsersController {
  constructor(private readonly createUsersService: CreateUserService) {}

  @Post()
  async create(@Body() body: CreateUserDto) {
    const { user } = await this.createUsersService.run(body);

    return user;
  }
}
