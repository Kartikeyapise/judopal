import { IsDefined, IsIn, IsNumberString, IsOptional, IsString } from "class-validator";

export class DaoUserDto{
    @IsDefined()
    @IsNumberString()
    daoId : string;

    @IsOptional()
    @IsString()
    showDisableUser?: string;

    @IsOptional()
    @IsString()
    @IsIn([ 'ALL','1M','1W'])
    timeFilter?: string;
}