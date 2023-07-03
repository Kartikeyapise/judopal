import { Transform } from "class-transformer";
import {IsArray, IsBoolean, IsDefined, IsEmail, IsOptional, IsString} from "class-validator";

export class UpdateUserProfileDto{
    @IsOptional()
    @IsString()
    userName : string;

    @IsOptional()
    @IsString()
    headline?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    twitter?: string;

    @IsOptional()
    @Transform((val:any) => { return JSON.parse(val?.value)})
    @IsArray()
    @IsString({each : true})
    skills?: string[];
    
    @IsOptional()
    @IsString()
    github?: string;

    @IsOptional()
    @IsString()
    website?: string;

    @IsOptional()
    @IsString()
    profileName?: string;

    @IsOptional()
    @IsEmail()
    @IsString()
    emailId?: string;

    @IsOptional()
    @IsBoolean()
    newUser?: boolean;

    @IsOptional()
    @IsString()
    publicKey?: string;
}