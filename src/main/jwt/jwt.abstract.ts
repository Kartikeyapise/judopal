export abstract class JwtInterface {
    abstract getToken(data:any,expiresIn?: string);
    abstract validateToken(token : string);

}