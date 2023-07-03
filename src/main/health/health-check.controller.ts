import {Controller, Get, Inject, Req} from '@nestjs/common';
import {ModifiedRequest} from "../../../lib/Types";
import {HealthCheckService} from "./health-check.service";

@Controller('ping')
export class HealthCheckController {

    @Inject(HealthCheckService)
    private readonly HealthCheckService : HealthCheckService;

    @Get('open')
    async ping(@Req() req : ModifiedRequest){
        return this.HealthCheckService.ping();
    }
}
