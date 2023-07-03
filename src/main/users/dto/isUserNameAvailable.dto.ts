import { IsDefined, IsString, MinLength } from "class-validator";

export class IsUserNameAvailableDto{
    @IsDefined()
    @IsString()
	@MinLength(1)
    userName: string;
}