export abstract class NetworkInterface{
    abstract get(url: string,headers?: any, options?: any): Promise<any>;
	abstract post(url: string, params: any, headers?: any, options?: any): Promise<any>;
    abstract put(url: string, params?: any, headers?: any, options?: any): Promise<any>
    abstract delete(url: string, headers?: any, options?: any): Promise<any>
    abstract getV1(options?: any) : Promise<any>;
}