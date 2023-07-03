import { Logger } from "@nestjs/common";
import { Helper } from "../../lib/Helper";
import { OptionsType, TransactionOptions } from "../../lib/Types";
import { DataSource, EntityMetadata, FindManyOptions, FindOneOptions, InsertResult, ObjectType, QueryRunner } from "typeorm";
import * as lodash from 'lodash';
const newrelic = require('newrelic');

export class QueryExecutor {
	private queryRunner: QueryRunner;
	private clearTimeoutHandleForRelease: NodeJS.Timer;
	static ISOLATION_LEVEL = {
		SERIALIZABLE: 'SERIALIZABLE',
		REPEATABLE_READ: 'REPEATABLE READ',
		READ_COMMITTED: 'READ COMMITTED',
		READ_UNCOMMITTED: 'READ UNCOMMITTED',
	};
	constructor() {
		this.getQueryConnection();
	}
	getQueryConnection() {
		const connectionPool = (global as any).dbConnectionPool;
		this.queryRunner = connectionPool.createQueryRunner();
	}

	private getTransactionTimeout() {
		return 3600000;
	}

	async beginTransaction(defaultOptions: TransactionOptions = {}) {
		const options = {
			isolation: QueryExecutor.ISOLATION_LEVEL.READ_COMMITTED,
			transactionTimeout: this.getTransactionTimeout(),
			...defaultOptions,
		};
		options['transactionTimeout'] = options['transactionTimeout'] ?? 30000;

		await this.queryRunner.connect();

		await this.queryRunner.startTransaction(
			Object.values(QueryExecutor.ISOLATION_LEVEL).includes(options.isolation) ? (options.isolation as any) : undefined,
		);
		await this.queryRunner.query(`SET LOCAL statement_timeout = ${options.transactionTimeout};
									  SET LOCAL idle_in_transaction_session_timeout = ${options.transactionTimeout};`);

		// Check if the queryExecutor has commited within idle transaction timeout time
		this.clearTimeoutHandleForRelease = setTimeout(
			async (queryObject) => {
				const queryRunner: QueryRunner = queryObject.queryRunner;
				if (!queryRunner.isReleased) {
					// releasing this connection is very important
					// otherwise it will keep the connection and starve the server for any db connection
					await queryRunner.release();
				}
			},
			10 * options.transactionTimeout,
			this,
		);
	}
	async commit() {
		if (!this.queryRunner.isTransactionActive || this.queryRunner.isReleased) {
			return;
		}
		clearTimeout(this.clearTimeoutHandleForRelease);
		await this.queryRunner.commitTransaction();
		await this.queryRunner.release();
	}

	async rollback() {
		if (!this.queryRunner.isTransactionActive || this.queryRunner.isReleased) {
			return;
		}
		clearTimeout(this.clearTimeoutHandleForRelease);
		try {
			await this.queryRunner.rollbackTransaction();
		} catch (error) {
			newrelic.noticeError(
				error
			);
			Logger.log('Error');
		}

		await this.queryRunner.release();
	}

	async save(entity: any, tableName: string) {
		if (!this.queryRunner.isTransactionActive) {
			throw Error('Transaction Not Yet Started');
		}
		return this.queryRunner.manager.save(tableName, entity);
	}

	async insert<Entity = any>(
		entity: any,
		tableName: string | ObjectType<Entity>,
		dbArr = false,
		options?: { onConflict: { column: string; condition?: string; action: string } },
	) {
		if (Helper.whatIsIt(tableName) !== 'String') {
			tableName = this.queryRunner.manager.getRepository<Entity>(tableName).metadata.tableName;
		}

		if (!this.queryRunner.isTransactionActive) {
			throw new Error('transaction has not been started');
		}
		let clonedEntity = lodash.cloneDeep(Object.values(entity));
		clonedEntity = clonedEntity.map((ele) => {
			if (Helper.whatIsIt(ele) === 'Object') {
				return JSON.stringify(ele);
			}
			if (Helper.whatIsIt(ele) === 'Array') {
				if (!dbArr && ele instanceof Array && ele.length > 0) {
					const jsonbArray = ele.some((data) => Helper.whatIsIt(data) === 'Object');
					if (jsonbArray) {
						return JSON.stringify(ele);
					}
				}
				return ele;
			}
			return ele;
		});
		const query = `
	 		INSERT INTO ${tableName} (${Object.keys(entity).map((ele) => `\"${ele}\"`)}) VALUES ${Helper.getInStr(Object.keys(entity).length)} ${options?.onConflict
				? `ON CONFLICT (${options.onConflict.column}) ${options.onConflict.condition ? options.onConflict.condition : ''}  ${options.onConflict.action}`
				: ''
			} RETURNING *;
	 	`;
		return Promise.resolve(this.query(query, clonedEntity)).get(0);
	}
	async insertMultiple<Entity = any>(entity: any, tableName: string | ObjectType<Entity>, dbArr = false, options?: any) {
		if (!this.queryRunner.isTransactionActive) {
			throw new Error('transaction has not been started');
		}

		if (Helper.whatIsIt(tableName) !== 'String') {
			tableName = this.queryRunner.manager.getRepository<Entity>(tableName).metadata.tableName;
		}

		let onConflict: any;
		if (options && options.onConflict && typeof options.onConflict === 'object') {
			onConflict = `(${options.onConflict.column}) ${options.onConflict.condition ? options.onConflict.condition : ''}  ${options.onConflict.action}`;
		} else if (options && options.onConflict && typeof options.onConflict === 'string') {
			onConflict = options.onConflict;
		} else {
			onConflict = null;
		}
		const result = await this.queryRunner.manager
			.createQueryBuilder()
			.insert()
			.into(tableName)
			.values(entity)
			.onConflict(onConflict)
			.returning('*')
			.execute();

		const finalResult = result.raw instanceof Array && result.raw.length > 1 ? result.raw : result.raw[0];
		return finalResult;
	}

	async insertMultipleV2<Entity = any>(entity: any[], tableName: string | ObjectType<Entity>, dbArr = false, options: OptionsType<any> = {}) {
		if (!this.queryRunner.isTransactionActive) {
			throw new Error('transaction has not been started');
		}
		let onConflict: any;
		if (options && options.onConflict && typeof options.onConflict === 'object') {
			onConflict = `(${options.onConflict.column}) ${options.onConflict.condition ? options.onConflict.condition : ''}  ${options.onConflict.action}`;
		} else if (options && options.onConflict && typeof options.onConflict === 'string') {
			onConflict = options.onConflict;
		} else {
			onConflict = null;
		}
		const result: InsertResult = await this.queryRunner.manager
			.createQueryBuilder()
			.insert()
			.into(tableName)
			.values(entity)
			.onConflict(onConflict)
			.returning('*')
			.execute();

		return result.generatedMaps as Entity[];
	}

	async findByIds<Entity = any>(tableName: string | ObjectType<Entity>, ids: string[]) {
		if (!this.queryRunner.isTransactionActive) {
			throw new Error('transaction has not been started');
		}
		return this.queryRunner.manager.findByIds<Entity>(tableName as any, ids);
	}

	async getInvalidIds(tableName: string, columnName: string, objectIds: string[]) {
		const validData = await this.findByIds(tableName, objectIds);
		return lodash.difference(
			objectIds,
			validData.map((data) => data[columnName]),
		);
	}

	async update<Entity = any>(entity: any, tableName: string | ObjectType<Entity>, filter: any = { id: entity.id }, convertToCamelCase: boolean = false) {
		if (!this.queryRunner.isTransactionActive) {
			throw new Error('transaction has not been started');
		}
		this.setQueryUnderExecution({ updateEntity: entity, filter });
		// const result = await this.queryRunner.manager.update(tableName, filter, entity);
		// console.log(result);
		const updatedFilter = await this.validateAndUpdateEntityProperties(tableName, filter);

		const result = await this.queryRunner.manager
			.createQueryBuilder()
			.update(tableName)
			.set(entity)
			.where(updatedFilter)
			.returning('*')
			.execute();
		return convertToCamelCase ? Helper.convertToCamelCaseObject(result.raw) : result.raw;
	}

	async updateV2<Entity = any>(entity: any, tableName: string | ObjectType<Entity>, filter: any = { id: entity.id }) {
		if (!this.queryRunner.isTransactionActive) {
			throw new Error('transaction has not been started');
		}
		this.setQueryUnderExecution({ updateEntity: entity, filter });
		const updatedFilter = await this.validateAndUpdateEntityProperties(tableName, filter);

		const result = await this.queryRunner.manager
			.createQueryBuilder()
			.update(tableName)
			.set(entity)
			.where(updatedFilter)
			.returning('*')
			.execute();
		return result.generatedMaps as Entity[];
	}

	async query(queryString: string, params?: any[], options: { isUpdateQuery?: boolean } = {}) {
		const { isUpdateQuery } = options;
		if (!this.queryRunner.isTransactionActive) {
			throw new Error('transaction has not been started');
		}
		const result = await this.queryRunner.query(queryString, params);
		return result?.length && !!isUpdateQuery ? result[0] : result;
	}

	private setQueryUnderExecution(query?: any) {
		(this.queryRunner as any).queryUnderExecution = query;
	}

	async validateAndUpdateEntityProperties<Entity = any>(tableName: string | ObjectType<Entity>, filter: any) {
		if (Helper.whatIsIt(tableName) !== 'String') {
			tableName = this.queryRunner.manager.getRepository<Entity>(tableName).metadata.tableName;
		}
		const columnMetadata = await this.findMetadata(tableName);
		const columnNames = columnMetadata.map((item) => item.propertyName);
		let clonedFilter = filter;
		if (Helper.whatIsIt(filter) === 'Array') {
			clonedFilter = lodash.clone(filter);
			clonedFilter.forEach((filterItem, index) => {
				Object.keys(filterItem).forEach((item: string) => {
					if (!columnNames.includes(item)) {
						delete filterItem[item];
					}
				});
			});
			clonedFilter = clonedFilter.filter((filterItem) => filterItem && !lodash.isEmpty(filterItem));
		}
		if (Helper.whatIsIt(filter) === 'Object') {
			clonedFilter = lodash.cloneDeep(filter);
			Object.keys(clonedFilter).forEach((item: string) => {
				if (!columnNames.includes(item)) {
					delete clonedFilter[item];
				}
			});
		}
		return clonedFilter;
	}

	async findMetadata<Entity = any>(cls: string | ObjectType<Entity>) {
		if (!this.queryRunner.isTransactionActive) {
			throw new Error('transaction has not been started');
		}

		const dbConnectionPool = (global as any).dbConnectionPool;

		if (!dbConnectionPool) {
			throw new Error('Error in Connecting to Database');
		}
		const metadata = (dbConnectionPool as DataSource).getMetadata(cls).columns;
		return metadata;
	}

	async findOne<Entity = any>(tableName: string | ObjectType<Entity>, filter: any, options: any = {}) {
		if (!this.queryRunner.isTransactionActive) {
			throw new Error('transaction has not been started');
		}
		const updatedFilter = await this.validateAndUpdateEntityProperties(tableName, filter);
		const findConditions: FindOneOptions = {
			where: updatedFilter,
			relations: options.relations,
		};
		if (options.sort && options.sort.field && options.sort.sortOrder) {
			findConditions.order = {};
			findConditions.order[options.sort.field] = options.sort.sortOrder;
		}
		if (options.select && options.select instanceof Array && options.select.length > 0) {
			findConditions.select = options.select;
		}
		if (options.lockMode) {
			findConditions.lock = options.lockMode;
		}
		return this.queryRunner.manager.findOne<Entity>(tableName as any, findConditions);
	}

	/*
	Implement FOR UPDATE and FOR SHARE type locks in find queries
	use options.lockMode = "pessimistic_write" for FOR UPDATE
	options.lockMode = "pessimistic_read" for FOR SHARE
	*/
	async find<Entity = any>(tableName: string | ObjectType<Entity>, filter: any = {}, options: any = {}) {
		if (!this.queryRunner.isTransactionActive) {
			throw new Error('transaction has not been started');
		}
		const updatedFilter = await this.validateAndUpdateEntityProperties(tableName, filter);
		const findConditions: FindManyOptions = {
			where: updatedFilter,
			relations: options.relations,
		};

		if (options.select && options.select instanceof Array && options.select.length > 0) {
			findConditions.select = options.select;
		}

		if (options.sort && options.sort.field && options.sort.sortOrder) {
			findConditions.order = {};
			findConditions.order[options.sort.field] = options.sort.sortOrder;
		}
		if (options.limit) {
			findConditions.take = options.limit;
		}
		if (options.lockMode) {
			findConditions.lock = options.lockMode;
		}
		return this.queryRunner.manager.find<Entity>(tableName as any, findConditions);
	}

	async delete<Entity = any>(tableName: string | ObjectType<Entity>, conditions: any) {
		if (!this.queryRunner.isTransactionActive) {
			throw new Error('transaction has not been started');
		}
		const updatedConditions = await this.validateAndUpdateEntityProperties(tableName, conditions);
		console.log(updatedConditions);
		const result = await this.queryRunner.manager.delete<Entity>(tableName, updatedConditions);
		return result.raw;
	}

	async deleteV2<Entity = any>(tableName: string | ObjectType<Entity>, conditions: any) {
		if (!this.queryRunner.isTransactionActive) {
			throw new Error('transaction has not been started');
		}
		const updatedConditions = await this.validateAndUpdateEntityProperties(tableName, conditions);
		const result = await this.queryRunner.manager.delete<Entity>(tableName, updatedConditions);
		return result;
	}

	async count(tableName: string, filter: any) {
		if (!this.queryRunner.isTransactionActive) {
			throw new Error('transaction has not been started');
		}
		const updatedFilter = await this.validateAndUpdateEntityProperties(tableName, filter);
		return this.queryRunner.manager.count(tableName, updatedFilter);
	}

	getEntityMetadatas(): EntityMetadata[] {
		return this.queryRunner.connection.entityMetadatas;
	}
}