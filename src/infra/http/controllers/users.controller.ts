import { CreateUserService } from '@app/services/create-user/create-user.service';
import { JwtAuthGuard } from '@infra/auth/guards/jwt.guard';
import { AuthenticatedRequest } from '@infra/auth/interfaces/auth-request.interface';
import { CreateUserDto } from '@infra/http/dtos/create-user.dto';
import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';

@Controller('users')
export class UsersController {
  constructor(private readonly createUsersService: CreateUserService) {}

  @Post()
  async create(@Body() body: CreateUserDto) {
    const { user } = await this.createUsersService.run(body);

    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async get(@Req() req: AuthenticatedRequest) {
    console.log(req.user.id);
  }
}
