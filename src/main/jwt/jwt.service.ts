import { Injectable } from "@nestjs/common";
import { JwtInterface } from "./jwt.abstract";
const jwt =  require('jsonwebtoken');

@Injectable()
export class JwtService extends JwtInterface{
    async getToken(data:any,expiresIn?: string){
        expiresIn = expiresIn || '2d';
        const token = jwt.sign({...data},process.env.JWT_SECRET,{ expiresIn : expiresIn });
        return token;
    }
    
    validateToken(token : string){
        const jwtToken = token?.split(' ');
        if(jwtToken.length != 2 || jwtToken[0] != 'Bearer'){
            throw Error('Invalid Auth Token');
        }
        const data = jwt.verify(jwtToken[1],process.env.JWT_SECRET,(err,result) => {
            if(err){
                throw err;
            }
            return result;
        });
        return data;
    }
}