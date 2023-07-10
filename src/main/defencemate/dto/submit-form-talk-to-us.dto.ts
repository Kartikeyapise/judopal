import { Type } from "class-transformer";
import { IsArray, IsDateString, IsDefined, IsOptional, IsString, ValidateNested } from "class-validator";

export class SubmitFormTalkToUsDto{
    @IsDefined()
    @IsString()
    fullName : string;

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
