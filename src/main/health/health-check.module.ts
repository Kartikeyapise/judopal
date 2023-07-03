import { Module } from '@nestjs/common';
import {HealthCheckService} from "./health-check.service";
import {HealthCheckController} from "./health-check.controller";


@Module({
    imports: [],
    controllers: [HealthCheckController],
    providers: [HealthCheckService],
    exports:[HealthCheckService]
})
export class HealthCheckModule {}
