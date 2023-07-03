import { OptionsType } from "../../../../lib/Types";
import { Users } from "../../users/entity/user.entity";
import { SignatureDto } from "../dto/signature.dto";

export abstract class AuthenticationInterface {
    abstract generateVerificationMessage(publicAddress: string);
    abstract metamaskLogin(token: string, signature: string, options?: OptionsType<{}>);
    abstract connectMetamaskLogin(token : string, signature : string, user : Users,options ?: OptionsType<{ isWalletConnect : boolean; }>);
    abstract connectMetamaskGenVerMessage(publicAddress : string);
}