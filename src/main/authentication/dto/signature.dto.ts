import { IsDefined, IsString } from "class-validator";

export class SignatureDto {
    @IsDefined()
    @IsString()
    signature: string;

    @IsDefined()
    @IsString()
    message: string;
}
