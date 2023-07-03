import { Body, Controller, Get, Inject, Post, Query, Req } from "@nestjs/common";
import { ModifiedRequest } from "../../../lib/Types";
import { AuthenticationService } from "./authentication.service";
import { GenerateVerificationMessageDto } from "./dto/generateVerificationMessage.dto";
import { MetamaskLogin } from "./dto/metamaskLogin.dto";
import { AuthenticationInterface } from "./interface/authentication.abstract";
import { SignatureDto } from "./dto/signature.dto";

@Controller('auth')
export class AuthenticationController {

    @Inject(AuthenticationService)
    private readonly AuthenticationService: AuthenticationInterface;

    //login by metamask
    @Post('metamask')
    async generateVerificationMessage(@Body() body: GenerateVerificationMessageDto) {
        const { publicAddress } = body;
        return await this.AuthenticationService.generateVerificationMessage(publicAddress);
    }

    @Post('metamask/login')
    async metamasklogin(@Body() body: MetamaskLogin) {
        const { token, signature, isWalletConnect } = body;
        return await this.AuthenticationService.metamaskLogin(token, signature, isWalletConnect);
    }

    //Generate Verification Message - Connect Metamask
    @Post('connect/metamask')
    async connectMetamaskGenVerMessage(@Body() body: GenerateVerificationMessageDto) {
        const { publicAddress } = body;
        return await this.AuthenticationService.connectMetamaskGenVerMessage(publicAddress);
    }

    // connect metamask
    @Post('connect/metamask/login')
    async connectMetamaskLogin(@Body() body: MetamaskLogin, @Req() req) {
        const { token, signature, isWalletConnect } = body;
        const { user } = req;
        return await this.AuthenticationService.connectMetamaskLogin(token, signature, user, { isWalletConnect });
    }
}