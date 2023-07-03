import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import Constants from "../../lib/Constants";
import { Helper } from "../../lib/Helper";
import { Exception } from "../../lib/Types";


@Catch(HttpException, Error)
export class GlobalExceptionFilter implements ExceptionFilter {
	constructor() {}

	async catch(exception: HttpException | Error, host: ArgumentsHost): Promise<void> {
		const isProductionEnvironment = ['prod'].includes(process.env.NODE_ENV!);
		const errorReason = '';
		if (!isProductionEnvironment) {
			// eslint-disable-next-line no-console
			console.log(exception);
		}

		const ctx = host.switchToHttp();
		const res = ctx.getResponse();
		const req = ctx.getRequest();
		const user = req.user;

		const statusCode = Helper.generateStatusCode(exception)();
		res.status(statusCode).json({
			error: {
				message: statusCode === HttpStatus.INTERNAL_SERVER_ERROR ? Constants.DEFAULT_MESSAGE_FOR_INTERNAL_SERVER_ERROR : exception.message,
				errorCode: (exception as Exception).errorCode,
				stack: !isProductionEnvironment ? exception.stack : undefined,
				reason: !isProductionEnvironment ? errorReason : undefined,
			},
		});
	}
}
