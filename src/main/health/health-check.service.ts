import { Injectable } from "@nestjs/common";

@Injectable()
export class HealthCheckService{
    ping() {
        return "healthy";
    }
}