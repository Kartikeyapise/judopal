import { HttpException } from "@nestjs/common";
import { QueryExecutor } from "src/common/query-executor";
import { Users } from "src/main/users/entity/user.entity";

export type OptionsType<T = {}> = {
	queryExecutor?: QueryExecutor | undefined;
} & Partial<T>;

export type TransactionOptions = {
	isolation?: string;
	transactionTimeout?: number;
};

export type Exception = (HttpException | Error) & { errorCode?: string; status?: number };

export type GenericKeyValue<T> = Record<string, T>;
export type ErrorOptionsType<T = unknown> = {
	internalErrorMessage?: string;
} & GenericKeyValue<T>;


export type ModifiedRequest = Request & { user: Users; domain_url: string; };

export enum VERIFICATION_TYPE {
	NATIVE= 'NATIVE'
}

export enum USER_ROLES {
	ATTENDEE = 'ATTENDEE',
	ADMIN = 'ADMIN',
	SPONSOR = 'SPONSOR',
	SPEAKER = 'SPEAKER'
}