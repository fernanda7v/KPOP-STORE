import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { AccessLogsController } from './access-logs.controller';
import { AccessLogsService } from './access-logs.service';
import { AccessLog } from './entities/access-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AccessLog, User])],
  controllers: [AccessLogsController],
  providers: [AccessLogsService],
  exports: [AccessLogsService],
})
export class AccessLogsModule {}