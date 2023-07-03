import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { NetworkModule } from './network/network.module';
import {ConfigModule} from "@nestjs/config";
import { HealthCheckModule} from "./health/health-check.module";
import {EventsModule} from "./events/events.module";
// import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.development.env',
    }),
    // MongooseModule.forRoot(process.env.MONGODB_URI),
    DatabaseModule,
    UsersModule,
    AuthenticationModule,
    NetworkModule,
    HealthCheckModule,
    EventsModule,
  ],
  controllers: [],
  providers: [],
})
export class MainModule {}
