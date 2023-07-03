import { Injectable } from '@nestjs/common';
import { UsersInterface } from './interface/users.abstract';
import { CreateUser } from './dto/createUser.dto';
import { QueryExecutor } from 'src/common/query-executor';
import { Helper } from '../../../lib/Helper';
import { OptionsType } from '../../../lib/Types';
import { Users } from './entity/user.entity';
import { UpdateUserDto } from './dto/updateUser.dto';

@Injectable()
export class UsersService extends UsersInterface {

    async createUser(user: CreateUser, options?: OptionsType) {
        let queryExecutor: QueryExecutor | undefined;
        try {
            queryExecutor = await Helper.getQueryExecutor();
            const insertUser: any = {
                wallet_address: user.walletAddress,
                public_key: user.publicKey,
                created_at: new Date(),
                updated_at: new Date()
            }

            if (!insertUser.profile_picture) {
                insertUser.profile_picture;
            }

            if (insertUser) {
                insertUser.user_name = user.userName;
            }

            if (user.isMetamaskConnected) {
                insertUser.is_metamask_connected = user.isMetamaskConnected;
            }

            if (user.profileName) {
                insertUser.profile_name = user.profileName;
            }

            if (user.lastSignedIn) {
                insertUser.last_signed_in = user.lastSignedIn;
            }

            if (user.isWalletConnectConnected) {
                insertUser.is_wallet_connect_connected = user.isWalletConnectConnected;
            }

            if (user.nearWalletKey) {
                insertUser.near_wallet_key = user.nearWalletKey;
            }

            if (user.isNearConnected) {
                insertUser.is_near_connected = user.isNearConnected;
            }

            let userObj = await queryExecutor.insert(insertUser, Users);
            userObj = Helper.convertToCamelCaseObject(userObj);

            await Helper.commit(queryExecutor, options);
            return userObj;
        }
        catch (err) {
            await Helper.rollback(queryExecutor, options);
            throw err;
        }
    }

    async findUser(filter : any, options?: OptionsType) {
        let queryExecutor: QueryExecutor | undefined;
        try {
            queryExecutor = await Helper.getQueryExecutor(options);
            const userObj: Users | null = await queryExecutor.findOne(Users, filter);
            await Helper.commit(queryExecutor, options);
            return userObj;
        }
        catch (err) {
            await Helper.rollback(queryExecutor, options);
            throw err;
        }
    }

    async updateUsers(params: UpdateUserDto,user : Users,options?: OptionsType<{}>) {
        let queryExecutor:QueryExecutor|undefined;
        try{
            queryExecutor = await Helper.getQueryExecutor(options);
            
            const userObj = await queryExecutor.update(params,Users,{id : user.id});

            await Helper.commit(queryExecutor,options);
            return userObj;
        }
        catch(err){
            await Helper.rollback(queryExecutor,options);
            throw err;
        }
    }

}
