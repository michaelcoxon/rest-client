import { IHttpClient, IHttpRequest, IHttpFilter } from "../interfaces/HttpClientInterfaces";
import { HttpMethod } from "../interfaces/HttpClientEnums";
import { XhrHttpRequest } from "./XhrHttpRequest";



export class XhrHttpClient implements IHttpClient
{
    public readonly filters: IHttpFilter[];

    constructor(filters?: IHttpFilter[])
    {
        this.filters = filters || [];
    }

    createRequest(method: HttpMethod, uri: string): IHttpRequest
    {
        return new XhrHttpRequest(method, uri, this.filters);
    }
}