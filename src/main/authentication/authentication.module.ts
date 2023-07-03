import { Module } from '@nestjs/common';
import { JwtModule } from '../jwt/jwt.module';
import { NetworkModule } from '../network/network.module';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [NetworkModule,JwtModule,UsersModule],
  controllers: [AuthenticationController],
  providers: [AuthenticationService],
})
export class AuthenticationModule {}
