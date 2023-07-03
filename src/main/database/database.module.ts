import { Module } from '@nestjs/common';
import { DbConnectionService } from './database.service';

@Module({
  providers: [DbConnectionService],
  exports:[DbConnectionService]
})
export class DatabaseModule {}
