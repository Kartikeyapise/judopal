import { IsDefined, IsOptional, IsString } from "class-validator";

export class ProfileFetchDto{
    @IsOptional()
    @IsString()
    userId?: string;
}