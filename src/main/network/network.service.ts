import { Injectable } from "@nestjs/common";
import { AxiosError } from "axios";
import { NetworkInterface } from "./network.abstract";
import {Helper} from "../../../lib/Helper";
import Constants from "../../../lib/Constants";
const axios = require('axios').default;

@Injectable()
export class NetworkService extends NetworkInterface{
    async get(url: string, headers?: any, options?: any): Promise<any> {
		try {
			const result = await axios.get(url,headers);
			const toRet = result.data;
			return toRet;
		} catch (error) {
			await axios.post('https://onboarding-bot-discord-5dzspnb6za-uc.a.run.app/api/push/network/error',{ body : JSON.stringify(error),url,headers });

			// error = error as AxiosError<Error>;
			// if(!error?.isAxiosError){
			throw error;
			// }
			// throw new Error(error.response?.data.message);
		}
	}

	async post(url: string, params?: any, headers?: any, options?: any): Promise<any> {
		try {
			const result = await axios.post(url,params,headers);
			const toRet = result.data;
			return toRet;
		} catch (error) {
			await axios.post('https://onboarding-bot-discord-5dzspnb6za-uc.a.run.app/api/push/network/error',{ body : JSON.stringify(error),url,headers });

			// error = error as AxiosError<Error>;
			// if(!error?.isAxiosError){
			throw error;
			// }
			// throw new Error(error.response?.data.message);
		}
	}

	async put(url: string, params?: any, headers?: any, options?: any): Promise<any> {
		try {
			const result = await axios.put(url,params,headers);
			const toRet = result.data;
			return toRet;
		} catch (error) {
			await axios.post('https://onboarding-bot-discord-5dzspnb6za-uc.a.run.app/api/push/network/error',{ body : JSON.stringify(error),url,headers });
			throw error;
		}
	}

	async delete(url: string, headers?: any, options?: any): Promise<any> {
		try {
			const result = await axios.delete(url,headers);
			const toRet = result.data;
			return toRet;
		} catch (error) {
			await axios.post('https://onboarding-bot-discord-5dzspnb6za-uc.a.run.app/api/push/network/error',{ body : JSON.stringify(error),url,headers });
			throw error;
		}
	}

	async getV1(options?: any): Promise<any> {
		try{
			const res = await axios.request(options);
			return res?.data;
		}
		catch(error){
			await axios.post('https://onboarding-bot-discord-5dzspnb6za-uc.a.run.app/api/push/network/error',{ body : JSON.stringify(error),options });

			// error = error as AxiosError<Error>;
			// if(!error?.isAxiosError){
			throw error;
			// }
			// throw new Error(error.response?.data.message);
		}
	}
}
