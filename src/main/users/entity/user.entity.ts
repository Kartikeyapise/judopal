import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { USER_ROLES } from "../../../../lib/Types";

@Entity()
export class Users {
    static readonly tableName = 'users';

    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: string;

    @Column({ name: "last_signed_in", nullable: true, type: 'timestamp with time zone' })
    lastSignedIn?: Date | null;

    @Column({ name: 'user_name', type: 'text', nullable: true })
    userName?: string | null;

    @Column({ name: 'oauth_token', type: 'text', nullable: true })
    oauthToken?: string | null;

    @Column({ name: 'oauth_token_secret', type: 'text', nullable: true })
    oauthTokenSecret?: string | null;

    @Column({ name: 'no_of_sessions', type: 'int', default: 1 })
    noOfSessions: number;

    @Column({ name: 'created_at', type: 'timestamp with time zone' })
    createdAt: Date;

    @Column({ name: 'updated_at', type: 'timestamp with time zone' })
    updatedAt: Date;
}