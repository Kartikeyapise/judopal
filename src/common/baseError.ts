import { HttpException } from '@nestjs/common';
import { GenericKeyValue } from '../../lib/Types';

export class BaseError extends HttpException {
	addOptions(options: GenericKeyValue<unknown>): void {
		Object.keys(options).forEach((key) => {
			this[key] = options[key];
		});
	}
}
