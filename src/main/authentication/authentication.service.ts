import { Inject, Injectable } from "@nestjs/common";
import { NetworkInterface } from "../network/network.abstract";
import { NetworkService } from "../network/network.service";
import { AuthenticationInterface } from "./interface/authentication.abstract";
import { AuthenticationHelper } from "./authentication.helper";
import { UsersService } from "../users/users.service";
import { CreateUser } from "../users/dto/createUser.dto";
import { JwtService } from "../jwt/jwt.service";
import { JwtInterface } from "../jwt/jwt.abstract";
import { Users } from "../users/entity/user.entity";
import { UpdateUserDto } from "../users/dto/updateUser.dto";
import { UsersInterface } from "../users/interface/users.abstract";
import { OptionsType } from "../../../lib/Types";
import { QueryExecutor } from "src/common/query-executor";
import { Helper } from "../../../lib/Helper";

@Injectable()
export class AuthenticationService extends AuthenticationInterface {

    @Inject(NetworkService) private readonly NetworkService: NetworkInterface;
    @Inject(UsersService) private readonly UsersService: UsersInterface;
    @Inject(JwtService) private readonly JwtService: JwtInterface;

    async generateVerificationMessage(publicAddress: string) {
        // nounce = nounce.toString();
        try {
            const nounce = Math.floor(Math.random() * 1000000);
            const jwtToken = await this.JwtService.getToken({ message: `${nounce}`, publicAddress });
            return {
                'token': jwtToken,
                'message': `${nounce}`
            };
        }
        catch (err) {
            throw err;
        }
    }

    async metamaskLogin(token : string,signature : string,options?: OptionsType<{isWalletConnect : boolean;}>){
        let queryExecutor : QueryExecutor | undefined;
        try{
            
            const data = this.JwtService.validateToken(token);
            queryExecutor = await Helper.getQueryExecutor(options);

            if(AuthenticationHelper.verifySignedMessage(data.message,signature,data.publicAddress)){
                let user:Partial<CreateUser> = {
                    walletAddress : data.publicAddress,
                    lastSignedIn : new Date(),
                    isWalletConnectConnected : options.isWalletConnect
                }
                let userObj:Users|null = await this.UsersService.findUser({ walletAddress : user.walletAddress},{queryExecutor});
                let newUser = true;
                if(!userObj){
                    userObj = await this.UsersService.createUser({...user,noOfConnectedAccounts : 1,isMetamaskConnected : true},{queryExecutor});
                }
                else if(userObj.userName){
                    newUser = false;
                    const updateUser:UpdateUserDto = {
                        lastSignedIn : new Date(),
                        updatedAt : new Date(),
                        noOfSessions : userObj.noOfSessions + 1
                    }
                    await this.UsersService.updateUsers(updateUser,userObj,{queryExecutor});
                }
                await Helper.commit(queryExecutor,options);
                return {'access_token' : await this.JwtService.getToken(userObj), 'newUser' : newUser};
            }   
            throw Error('Signature Verification Failed');
            // await Helper.commit(queryExecutor);
        }
        catch(err){
            await Helper.rollback(queryExecutor,options);
            throw err;
        }
    }

    async connectMetamaskGenVerMessage(publicAddress: string) {
        try {
            return await this.generateVerificationMessage(publicAddress);
        }
        catch (err) {
            throw err;
        }
    }

    async connectMetamaskLogin(token: string, signature: string, user: Users, options?: OptionsType<{ isWalletConnect: boolean; }>) {
        // let queryExecutor: QueryExecutor | undefined;
        // try {
        //     const data = this.JwtService.validateToken(token);
        //     if (AuthenticationHelper.verifySignedMessage(data.message, signature, data.publicAddress)) {
        //         queryExecutor = await Helper.getQueryExecutor(options);
        //         let userObj = await this.UsersService.findUser({ id: user.id }, { queryExecutor });
        //         const updateUser: UpdateUserDto = {
        //             walletAddress: data.publicAddress,
        //             noOfConnectedAccounts: userObj.noOfConnectedAccounts + 1,
        //             isMetamaskConnected: true,
        //             isWalletConnectConnected: options.isWalletConnect
        //         };

        //         userObj = await this.UsersService.updateUsers(updateUser, user, { queryExecutor });
        //         await Helper.commit(queryExecutor, options);
        //         return { 'access_token': await this.JwtService.getToken(userObj[0]) };
        //     }
        //     throw Error('Signature Verification Failed');
        // }
        // catch (err) {
        //     await Helper.rollback(queryExecutor, options);
        //     throw err;
        // }
    }
    
}
