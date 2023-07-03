import { HttpStatus, ValidationError } from "@nestjs/common";
import Constants from "../../lib/Constants";
import { Helper } from "../../lib/Helper";
import { ErrorOptionsType } from "../../lib/Types";
import { BaseError } from "./baseError";

export class WrongInput extends BaseError {
	public message: string;
	public errorCode: string;
	public internalErrorMessage: string;
	constructor(input: string | ValidationError[], options: ErrorOptionsType = {}) {
		super(Constants.WRONG_INPUT_ERROR, HttpStatus.BAD_REQUEST);
		if (typeof input === 'string') {
			this.message = input;
		} else {
			const topReason = Helper.getTopReason(input);
			this.message = topReason;
		}
		this.addOptions(options);
	}
}