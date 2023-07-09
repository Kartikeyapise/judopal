import { Module } from '@nestjs/common';
import {EventsService} from "./events.service";
import {EventsController} from "./events.controller";
import {NetworkModule} from "../network/network.module";


@Module({
    imports: [NetworkModule],
    controllers: [EventsController],
    providers: [EventsService],
    exports:[EventsService]
})
export class EventsModule {}
