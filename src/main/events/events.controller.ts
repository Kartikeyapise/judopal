import {Controller, Get, Inject, Req} from '@nestjs/common';
import {ModifiedRequest} from "../../../lib/Types";
import {EventsService} from "./events.service";

@Controller('events')
export class EventsController {

    @Inject(EventsService)
    private readonly EventsService : EventsService;

    @Get('test/data')
    async ping(@Req() req : ModifiedRequest){
        return this.EventsService.getTestDataPoints();
    }
}
