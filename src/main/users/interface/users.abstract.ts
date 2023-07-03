import { OptionsType } from "lib/Types";
import { CreateUser } from "../dto/createUser.dto";
import { Users } from "../entity/user.entity";
import { UpdateUserDto } from "../dto/updateUser.dto";

export abstract class UsersInterface {
    abstract createUser(user: CreateUser, options?: OptionsType);
    abstract findUser(filter: any, options?: OptionsType);
    abstract updateUsers(params: UpdateUserDto,user : Users,options?: OptionsType<{}>)
}