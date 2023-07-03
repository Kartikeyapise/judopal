import { QueryExecutor } from ".././src/common/query-executor";
import { Exception, OptionsType } from "./Types";
import * as camelCase from 'camelcase';
import { HttpStatus, ValidationError } from "@nestjs/common";

export class Helper {

    static async getQueryExecutor(options: OptionsType<any> = {}) {
		const queryExecutor = await (async (_) => {
			if (options.queryExecutor) {
				return options.queryExecutor as QueryExecutor;
			}
			const queryExecutor = new QueryExecutor();
			await queryExecutor.beginTransaction({ transactionTimeout: options.timeout });
			return queryExecutor;
		})();
		return queryExecutor;
	}

	static async commit(queryExecutor: QueryExecutor | undefined | null, options: OptionsType<any> = {}) {
		if (queryExecutor && !options.queryExecutor) {
			await queryExecutor.commit();
		}
	}

	static async rollback(queryExecutor: QueryExecutor | undefined | null, options: OptionsType<any> = {}) {
		if (queryExecutor && !options.queryExecutor) {
			await queryExecutor.rollback();
		}
	}
	static stringConstructor = ''.constructor;
	static arrayConstructor = [].constructor;
	static objectConstructor = {}.constructor;
	static numberConstructor = (0).constructor;
	static dateConstructor = new Date().constructor;
	static booleanConstructor = true.constructor;

	static whatIsIt(object) {
		if (object === null) {
			return 'null';
		}
		if (object === undefined) {
			return 'undefined';
		}
		if (object.constructor === this.stringConstructor) {
			return 'String';
		}
		if (object.constructor === this.arrayConstructor) {
			return 'Array';
		}
		if (object.constructor === this.dateConstructor) {
			return 'Date';
		}
		if (object.constructor === this.objectConstructor || typeof object === 'object') {
			return 'Object';
		}
		if (object.constructor === this.numberConstructor) {
			return 'Number';
		}
		if (object.constructor === this.booleanConstructor) {
			return 'Boolean';
		}
		return 'Other';
	}

	static getInStr(length: number, startingPos: number = 1) {
		const paramInStrArr: any = [];
		for (let i = 0; i < length; i = i + 1) {
			paramInStrArr.push(`$${i + startingPos}`);
		}
		const paramsInStr = `(${paramInStrArr.join(',')})`;
		return paramsInStr;
	}
	static convertToCamelCaseObject(data: any) {
		let newData: any;
		let origKey: string;
		let newKey: string;
		let value: any;
		if (!data) {
			return data;
		}
		if (data instanceof Array) {
			return data.map((value) => {
				if (typeof value === 'object') {
					value = this.convertToCamelCaseObject(value);
				}
				return value;
			});
		}
		newData = {};
		for (origKey in data) {
			if (data.hasOwnProperty(origKey)) {
				newKey = camelCase(origKey);
				value = data[origKey];
				if (value instanceof Array || (!this.isVoid(value) && typeof value === 'object' && Helper.whatIsIt(value) !== 'Date')) {
					value = this.convertToCamelCaseObject(value);
				}
				newData[newKey] = value;
			}
		}
		return newData;
	}
	static isVoid(obj) {
		switch (typeof obj) {
			case 'undefined':
				return true;
			case 'object':
				if (obj instanceof Date) {
					return false;
				}
				if (obj === null) {
					return true;
				}
				for (const x in obj) {
					if (obj.hasOwnProperty(x)) {
						return false;
					}
					return true;
				}
				return true;
			case 'number':
			case 'boolean':
				return false;
			case 'string':
				if (obj === '' || obj === 'null' || obj === 'undefined') {
					return true;
				}
				return false;
			/* falls through */
			default:
				return false;
		}
	}
	
	static generateStatusCode(exception): Function {
		return () => {
			if ((exception as Exception).status) {
				return (exception as Exception).status;
			}
			return HttpStatus.INTERNAL_SERVER_ERROR;
		};
	}
	static getTopReason(validationErrors: ValidationError[], parent?: ValidationError) {
		const validationError = validationErrors[0];
		if (validationError.constraints) {
			const contexts = validationError.contexts;
			const prettyName: string | undefined = ((_) => {
				if (!contexts || !Object.keys(contexts).length) {
					return;
				}
				const key = Object.keys(contexts).find((key) => contexts[key].prettyName);
				if (!key) {
					return;
				}
				return contexts[key].prettyName;
			})();
			const property = parent ? `In ${parent.property}: ` : '';
			// tslint:disable-next-line:max-line-length
			return `${property}${Helper.replaceAll(
				Object.values(validationError.constraints).join('. '),
				[validationError.property, '_key'],
				prettyName || validationError.property,
			)}`;
		}
		if (validationError?.children?.length) {
			return Helper.getTopReason(validationError.children, validationError);
		}
	}
	static replaceAll(string: string, search: string | string[], replacement?: string) {
		if (!replacement) {
			return string;
		}
		const toSearch = search instanceof Array ? search : [search];
		return string.replace(new RegExp(`(${toSearch.join('|')})`, 'g'), replacement);
	}
}