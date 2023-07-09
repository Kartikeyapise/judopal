import {Inject, Injectable} from "@nestjs/common";
import {SubmitFormTalkToUsDto} from "./dto/submit-form-talk-to-us.dto";
import {OptionsType} from "../../../lib/Types";
import {NetworkService} from "../network/network.service";


// token:  "MTA3MjQwMzM5Mjk0MjU4Nzk1NA.GylkSS.mT9YKw2cZNodDqLiywODc4M_Xyz_R27aHwZbRc"
// https://discord.com/api/webhooks/1127540577005731910/n2D1TwufuvzXxL7QrGWZsqPqCXVCH2WSjxuDka05KTzGgj3JSBFwjtwQWW-CFEa5nMm8
@Injectable()
export class EventsService {


    @Inject(NetworkService)
    private readonly NetworkService: NetworkService;

    getTestDataPoints() {
        return [[0, 0], [1, 2], [2, 4], [3, 5], [4, 3], [5, 2.5], [6, 2.2], [7, 2]];
    }

    async submitFormTalkToUs(params: SubmitFormTalkToUsDto, options ?: OptionsType<{ domainUrl: string; }>) {
        let discordWebhookUrl: string = "https://discord.com/api/webhooks/1127540577005731910/n2D1TwufuvzXxL7QrGWZsqPqCXVCH2WSjxuDka05KTzGgj3JSBFwjtwQWW-CFEa5nMm8";
        let message:string = `${params.firstName} ${params.lastName} ||| ${params.phoneNumber} ||| ${params.company} ||| ${params.message}   /n `
        let body: any = {content: JSON.stringify(message)}
        let headers: any = {"Content-Type": "application/json"}
        let res: any = await this.NetworkService.post(discordWebhookUrl, body, {headers});
    }

}
    //     fetch(, {
    //         body: JSON.stringify({
    //             content: `test message`,
    //         }),
    //         headers: {
    //             "Content-Type": "application/json",
    //         },
    //         method: "POST",
    //     })
    //         .then(function (res) {
    //             console.log(res);
    //         })
    //         .catch(function (res) {
    //             console.log(res);
    //         });
    // }

