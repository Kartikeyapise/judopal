import { Injectable } from "@nestjs/common";

@Injectable()
export class EventsService {
    getTestDataPoints() {
        return [[0,0],[1,2],[2,4],[3,5],[4,3],[5,2.5],[6,2.2],[7,2]];
    }
}