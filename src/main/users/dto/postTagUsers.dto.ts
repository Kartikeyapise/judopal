import { IsDefined, IsString } from "class-validator";

export class PostTagUsersDto{
    @IsDefined()
    @IsString()
    daoId : string;

    @IsDefined()
    @IsString()
    channelId : string;
}