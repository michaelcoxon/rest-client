import { IHttpClient, IHttpRequest, IHttpFilter, IHttpRequestHeaderCollection } from "../interfaces/HttpClientInterfaces";
import { HttpMethod, KnownHeaderNames } from "../interfaces/HttpClientEnums";
import { XhrHttpRequest, XhrHttpResponse } from "./XhrHttpRequestResponse";
import { JsonResponseContent } from "../ResponseContent";
import { StringOrUrl, Url } from "../Url";
import { HttpRequestHeaderCollection } from "../HttpRequestHeaderCollection";
import { RequestCancelledException, ServiceException } from "..";



export class XhrHttpClient implements IHttpClient
{
    public static DefaultTimeout: number = 5000;
    public static DefaultIgnoreCache: boolean = false;
    public static DefaultHeaders: IHttpRequestHeaderCollection = new HttpRequestHeaderCollection(...[{
        name: KnownHeaderNames.accept,
        value: "application/json, text/javascript, text/plain"
    }]);

    public readonly filters: IHttpFilter[];

    private readonly _headers: IHttpRequestHeaderCollection;
    private readonly _ignoreCache: boolean;
    private readonly _timeout: number;

    constructor();
    constructor(filters: IHttpFilter[]);
    constructor(filters: IHttpFilter[], headers: IHttpRequestHeaderCollection);
    constructor(filters: IHttpFilter[], headers: IHttpRequestHeaderCollection, ignoreCache: boolean);
    constructor(filters: IHttpFilter[], headers: IHttpRequestHeaderCollection, ignoreCache: boolean, timeout: number);
    constructor(filters?: IHttpFilter[], headers?: IHttpRequestHeaderCollection, ignoreCache?: boolean, timeout?: number);
    constructor(filters?: IHttpFilter[], headers?: IHttpRequestHeaderCollection, ignoreCache?: boolean, timeout?: number)
    {
        this.filters = filters || [];
        this._headers = headers || XhrHttpClient.DefaultHeaders;
        this._ignoreCache = ignoreCache === undefined ? XhrHttpClient.DefaultIgnoreCache : ignoreCache;
        this._timeout = timeout === undefined ? XhrHttpClient.DefaultTimeout : timeout;
    }

    createRequest(method: HttpMethod, uri: string): IHttpRequest;
    createRequest(method: HttpMethod, uri: Url): IHttpRequest;
    createRequest(method: HttpMethod, uri: StringOrUrl): IHttpRequest;
    createRequest(method: HttpMethod, uri: StringOrUrl): IHttpRequest
    {
        return new XhrHttpRequest(method, uri, this.filters, this._headers, this._ignoreCache, this._timeout);
    }

    /**
     * Performs a get request to a JSON returning source and casts the object
     * @param uri as string
     * @throws RequestCancelledException when the request is cancelled
     * @throws ServiceException if the response is cancelled or if there was a status code in the error range
     */
    public async getObjectAsync<T>(uri: string): Promise<T>;
    /**
     * Performs a get request to a JSON returning source and casts the object
     * @param uri as Uri
     * @throws RequestCancelledException when the request is cancelled
     * @throws ServiceException if the response is cancelled or if there was a status code in the error range
     */
    public async getObjectAsync<T>(uri: Url): Promise<T>;
    /**
     * Performs a get request to a JSON returning source and casts the object
     * @param uri as string or Uri
     * @throws RequestCancelledException when the request is cancelled
     * @throws ServiceException if the response is cancelled or if there was a status code in the error range
     */
    public async getObjectAsync<T>(uri: StringOrUrl): Promise<T>;
    public async getObjectAsync<T>(uri: StringOrUrl): Promise<T>
    {
        const request = this.createRequest(HttpMethod.get, uri);

        request.headers.update(KnownHeaderNames.accept, "application/json");

        const response = await request.executeAsync();

        if (!response)
        {
            throw new RequestCancelledException(request);
        }

        if (response.cancelled || !response.ok)
        {
            throw new ServiceException(response);
        }

        const content = (await response.contentAsync) as JsonResponseContent;
        return content.toObject<T>();
    }

}