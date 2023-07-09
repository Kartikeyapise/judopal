import { Type } from "class-transformer";
import { IsArray, IsDateString, IsDefined, IsOptional, IsString, ValidateNested } from "class-validator";

export class SubmitFormTalkToUsDto{
    @IsDefined()
    @IsString()
    firstName : string;

    @IsDefined()
    @IsString()
    lastName : string;

    @IsDefined()
    @IsString()
    company : string;

    @IsDefined()
    @IsString()
    phoneNumber : string;

    @IsOptional()
    @IsString()
    message : string;

}
