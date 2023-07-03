import { IsDefined, IsString } from "class-validator";

export class GenerateVerificationMessageDto{
    @IsDefined()
    @IsString()
    publicAddress : string;
}