import { HttpStatusCode, HttpMethod, HttpContentEncoding, HttpResponseType } from "./HttpClientEnums";
import { KnownContentTypes } from "./KnownContentTypes";

export type HttpHeaderValue = string | number | string[] | undefined;

export interface IContentType
{
    contentType: KnownContentTypes | string;
    encoding: HttpContentEncoding | string | undefined;
}

export interface IHttpHeader
{
    readonly name: string;
    value: HttpHeaderValue;
}


export interface IHttpHeaderCollection
{
    add(name: string, value: HttpHeaderValue): void;
    addHeader(header: IHttpHeader): void;
    get(name: string): IHttpHeader | undefined;
    getAll(): IHttpHeader[];
    remove(name: string): boolean;
    update(name: string, value: HttpHeaderValue): void;
    toObject(): { [name: string]: HttpHeaderValue }
}


export interface IHttpResponseHeaderCollection extends IHttpHeaderCollection
{
    contentType: IContentType | undefined
}


export interface IHttpRequestHeaderCollection extends IHttpHeaderCollection
{
    authorization: string | undefined
}


export interface IHttpContentHeaderCollection extends IHttpHeaderCollection
{
    contentType: IContentType | undefined
}


export interface IHttpFilter
{
    /**
     * determin if this filter can handle the response
     * @param response the response
     * @returns Returns true if the filter can handle the response
     */
    canHandleResponse(response: IHttpResponse): boolean;
    /**
    * determin if this filter can handle the request
    * @param request the request
    * @returns Returns true if the filter can handle the request
    */
    canHandleRequest(request: IHttpRequest): boolean;
    /**
     * handles the response
     * @param response the response
     * @returns Returns true if the response should be cancelled.
     */
    handleResponse(response: IHttpResponse): boolean | void;
    /**
    * handles the request
    * @param request the request
    * @returns Returns true if the request should be cancelled.
    */
    handleRequest(request: IHttpRequest): boolean | void;
}


export interface IHttpResponseContent
{

}

export interface IHttpRequestContent
{
    readonly headers: IHttpContentHeaderCollection;
    executeAsync<TResult>(contentWriter: (data?: any) => (TResult | PromiseLike<TResult>)): Promise<TResult>
}


export interface IHttpResponse
{
    readonly cancelled: boolean;
    readonly ok: boolean;
    readonly status: HttpStatusCode;
    readonly statusText: string;
    readonly headers: IHttpResponseHeaderCollection;
    readonly contentAsync: Promise<IHttpResponseContent>;
    readonly response: any;
    readonly responseType: HttpResponseType;
    readonly request: Readonly<IHttpRequest>;
}


export interface IErrorHttpResponse extends IHttpResponse
{
    readonly message: string;
}


export interface IHttpRequest
{
    readonly headers: IHttpRequestHeaderCollection;
    readonly method: HttpMethod;
    readonly uri: string;

    content: IHttpRequestContent;

    executeAsync(): Promise<IHttpResponse | undefined>;
}


export interface IHttpClient
{
    readonly filters: IHttpFilter[];
    createRequest(method: HttpMethod, uri: string): IHttpRequest;
    getObjectAsync<T>(uri: string): Promise<T | undefined>;
}


export interface IHttpResponseContentHandler
{
    canHandle(response: IHttpResponse): boolean;
    handleAsync(response: IHttpResponse): Promise<IHttpResponseContent>;
}