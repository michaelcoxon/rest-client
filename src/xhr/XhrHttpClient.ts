import { IHttpClient, IHttpRequest, IHttpFilter } from "../interfaces/HttpClientInterfaces";
import { HttpMethod } from "../interfaces/HttpClientEnums";
import { XhrHttpRequest, XhrHttpResponse } from "./XhrHttpRequestResponse";
import { JsonResponseContent } from "../response-content/JsonResponseContent";



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

    public async getObjectAsync<T>(uri: string): Promise<T | undefined>
    {
        const request = this.createRequest(HttpMethod.get, uri);
        const response = await request.executeAsync();
        if (response)
        {
            return ((await response.contentAsync) as JsonResponseContent).toObject<T>();
        }
    }

}