import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpModule } from '@infra/http/http.module';
import { DatabaseModule } from '@infra/database/database.module';

@Module({
  imports: [HttpModule, DatabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
