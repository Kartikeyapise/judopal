import { IsDefined, IsEmail, IsString } from "class-validator";

export class IsEmailIdAvailableDto {
    @IsDefined()
    @IsString()
    @IsEmail()
    emailId : string;
}