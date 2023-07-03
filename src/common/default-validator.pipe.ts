import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { WrongInput } from './wrongInput';

@Injectable()
export class DefaultValidatorPipe implements PipeTransform {
	async transform(value: any, metadata: ArgumentMetadata) {
		const { metatype, type } = metadata;
		if (type === 'custom') {
			return value;
		}
		const object = !metatype ? value : plainToClass(metatype, value);
		const errors = await validate(object);
		if (errors.length) {
			throw new WrongInput(errors, {
				errorCode: 'EVAL000',
			});
		}
		return object;
	}
}
