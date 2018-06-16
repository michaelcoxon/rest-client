import { IHttpClient, IHttpRequest, IHttpFilter, IHttpRequestHeaderCollection } from "../interfaces/HttpClientInterfaces";
import { HttpMethod, KnownHeaderNames } from "../interfaces/HttpClientEnums";
import { XhrHttpRequest, XhrHttpResponse } from "./XhrHttpRequestResponse";
import { JsonResponseContent } from "../ResponseContent";
import { StringOrUrl, Url } from "../Url";
import { HttpRequestHeaderCollection } from "../HttpRequestHeaderCollection";
import { RequestCancelledException, ServiceException, JsonRequestContent } from "..";


/** Implementation of IHttpClient for XMLHttpRequest */
export class XhrHttpClient implements IHttpClient
{
    /** The default timeout for requests. default is 5000ms */
    public static DefaultTimeout: number = 5000;
    /** The default ignoreCache parameter for XHR. default is false */
    public static DefaultIgnoreCache: boolean = false;
    /** The default headers to use. defaults to Accept: application/json, text/javascript, text/plain */
    public static DefaultHeaders: IHttpRequestHeaderCollection = new HttpRequestHeaderCollection(...[{
        name: KnownHeaderNames.accept,
        value: "application/json, text/javascript, text/plain"
    }]);

    /** Collections of filters to use for the request/response */
    public readonly filters: IHttpFilter[];

    private readonly _headers: IHttpRequestHeaderCollection;
    private readonly _ignoreCache: boolean;
    private readonly _timeout: number;

    /** default constructor */
    constructor();
    /**
     * constructor
     * @param filters filters for the request/response
     */
    constructor(filters: IHttpFilter[]);
    /**
     * constructor
     * @param filters filters for the request/response
     * @param headers headers for the request
     */
    constructor(filters: IHttpFilter[], headers: IHttpRequestHeaderCollection);
    /**
     * constructor
     * @param filters filters for the request/response
     * @param headers headers for the request
     * @param ignoreCache the ignore cache setting. true means we will always get a new value, false means we will respect the servers cache settings.
     */
    constructor(filters: IHttpFilter[], headers: IHttpRequestHeaderCollection, ignoreCache: boolean);
    /**
     * constructor
     * @param filters filters for the request/response
     * @param headers headers for the request
     * @param ignoreCache the ignore cache setting. true means we will always get a new value, false means we will respect the servers cache settings.
     * @param timeout the timeout for the request
     */
    constructor(filters: IHttpFilter[], headers: IHttpRequestHeaderCollection, ignoreCache: boolean, timeout: number);
    /**
     * constructor
     * @param filters filters for the request/response
     * @param headers headers for the request
     * @param ignoreCache the ignore cache setting. true means we will always get a new value, false means we will respect the servers cache settings.
     * @param timeout the timeout for the request
     */
    constructor(filters?: IHttpFilter[], headers?: IHttpRequestHeaderCollection, ignoreCache?: boolean, timeout?: number);
    constructor(filters?: IHttpFilter[], headers?: IHttpRequestHeaderCollection, ignoreCache?: boolean, timeout?: number)
    {
        this.filters = filters || [];
        this._headers = headers || XhrHttpClient.DefaultHeaders;
        this._ignoreCache = ignoreCache === undefined ? XhrHttpClient.DefaultIgnoreCache : ignoreCache;
        this._timeout = timeout === undefined ? XhrHttpClient.DefaultTimeout : timeout;
    }

    /**
     * Creates a new request
     * @param method the HTTP method to use
     * @param uri the resource uri
     */
    createRequest(method: HttpMethod, uri: string): IHttpRequest;
    /**
     * Creates a new request
     * @param method the HTTP method to use
     * @param uri the resource uri
     */
    createRequest(method: HttpMethod, uri: Url): IHttpRequest;
    /**
     * Creates a new request
     * @param method the HTTP method to use
     * @param uri the resource uri
     */
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

    /**
     * Performs a post request to a JSON returning source and casts the object
     * @param uri as string
     * @throws RequestCancelledException when the request is cancelled
     * @throws ServiceException if the response is cancelled or if there was a status code in the error range
     */
    public async postObjectAsync<TData, TResponseData>(uri: string, data: TData): Promise<TResponseData>;
    /**
     * Performs a post request to a JSON returning source and casts the object
     * @param uri as Uri
     * @throws RequestCancelledException when the request is cancelled
     * @throws ServiceException if the response is cancelled or if there was a status code in the error range
     */
    public async postObjectAsync<TData, TResponseData>(uri: Url, data: TData): Promise<TResponseData>;
    /**
     * Performs a post request to a JSON returning source and casts the object
     * @param uri as string or Uri
     * @throws RequestCancelledException when the request is cancelled
     * @throws ServiceException if the response is cancelled or if there was a status code in the error range
     */
    public async postObjectAsync<TData, TResponseData>(uri: StringOrUrl, data: TData): Promise<TResponseData>;
    public async postObjectAsync<TData, TResponseData>(uri: StringOrUrl, data: TData): Promise<TResponseData>
    {
        const request = this.createRequest(HttpMethod.post, uri);

        request.content = new JsonRequestContent(data);
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
        return content.toObject<TResponseData>();
    }
}