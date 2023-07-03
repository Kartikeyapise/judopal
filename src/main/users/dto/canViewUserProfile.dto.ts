import { IsDefined, IsString } from "class-validator";

export class CanViewUserProfileDto{
    @IsDefined()
    @IsString()
    daoId : string;
}