import { IHttpClient, IHttpRequest, IHttpFilter, IHttpRequestHeaderCollection } from "../interfaces/HttpClientInterfaces";
import { HttpMethod } from "../interfaces/HttpClientEnums";
import { XhrHttpRequest, XhrHttpResponse } from "./XhrHttpRequestResponse";
import { JsonResponseContent } from "../ResponseContent";



export class XhrHttpClient implements IHttpClient
{
    public readonly filters: IHttpFilter[];

    private readonly _headers?: IHttpRequestHeaderCollection;
    private readonly _ignoreCache?: boolean;
    private readonly _timeout?: number;

    constructor();
    constructor(filters: IHttpFilter[]);
    constructor(filters: IHttpFilter[], headers: IHttpRequestHeaderCollection);
    constructor(filters: IHttpFilter[], headers: IHttpRequestHeaderCollection, ignoreCache: boolean);
    constructor(filters: IHttpFilter[], headers: IHttpRequestHeaderCollection, ignoreCache: boolean, timeout: number);
    constructor(filters?: IHttpFilter[], headers?: IHttpRequestHeaderCollection, ignoreCache?: boolean, timeout?: number);
    constructor(filters?: IHttpFilter[], headers?: IHttpRequestHeaderCollection, ignoreCache?: boolean, timeout?: number)
    {
        this.filters = filters || [];
        this._headers = headers;
        this._ignoreCache = ignoreCache;
        this._timeout = timeout;
    }

    createRequest(method: HttpMethod, uri: string): IHttpRequest
    {
        return new XhrHttpRequest(method, uri, this.filters, this._headers, this._ignoreCache, this._timeout);
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