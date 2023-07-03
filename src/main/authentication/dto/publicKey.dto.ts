import { IsDefined, IsString } from "class-validator";

export class PublicKeyDto {
    @IsDefined()
    @IsString()
    publicKey: string;
}
