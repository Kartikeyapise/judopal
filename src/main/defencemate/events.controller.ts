import {Body, Controller, Get, Inject, Post, Req} from '@nestjs/common';
import {ModifiedRequest} from "../../../lib/Types";
import {EventsService} from "./events.service";
import {SubmitFormTalkToUsDto} from "./dto/submit-form-talk-to-us.dto";

@Controller('defencemate')
export class EventsController {

    @Inject(EventsService)
    private readonly EventsService : EventsService;

    @Get('test/data')
    async ping(@Req() req : ModifiedRequest){
        return this.EventsService.getTestDataPoints();
    }

    @Post('submit/form')
    async submitFormTalkToUs(@Req() req : ModifiedRequest,@Body() body : SubmitFormTalkToUsDto){
        return this.EventsService.submitFormTalkToUs(body);
    }
}
