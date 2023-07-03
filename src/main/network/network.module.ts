import { Module } from '@nestjs/common';
import { NetworkService } from './network.service';

@Module({
  imports: [],
  controllers: [],
  providers: [NetworkService],
  exports:[NetworkService]
})
export class NetworkModule {}
