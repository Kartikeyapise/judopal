export class UpdateUserDto{
    userName?:string;
    firstName?:string;
    lastName?:string;
    profilePicture?:string;
    role?:string;
    walletAddress?:string;
    lastSignedIn?: Date;
    updatedAt?: Date;
    oauthToken?: string | null;
    oauthTokenSecret?: string | null;
    noOfSessions?: number;
}