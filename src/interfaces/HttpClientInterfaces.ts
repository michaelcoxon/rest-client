import { HttpStatusCode, HttpMethod, ContentEncoding } from "./HttpClientEnums";
import { KnownContentTypes } from "./KnownContentTypes";

export type HttpHeaderValue = string | number | string[] | undefined;


export interface IContentType
{
    contentType: KnownContentTypes | string;
    encoding?: ContentEncoding | string;
}

export interface IHttpHeader
{
    readonly name: string;
    value: HttpHeaderValue;
}


export interface IHeaderCollection
{
    add(name: string, value: HttpHeaderValue): void;
    addHeader(header: IHttpHeader): void;
    get(name: string): IHttpHeader | undefined;
    getAll(): IHttpHeader[];
    remove(name: string): boolean;
    update(name: string, value: HttpHeaderValue): void;
    toObject(): { [name: string]: HttpHeaderValue }
}


export interface IHttpResponseHeaderCollection extends IHeaderCollection
{

}


export interface IHttpRequestHeaderCollection extends IHeaderCollection
{
    authorization?: string
}


export interface IHttpContentHeaderCollection extends IHeaderCollection
{
    contentType?: IContentType
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
    handleResponse(response: IHttpResponse): boolean | undefined;
    /**
    * handles the request
    * @param request the request
    * @returns Returns true if the request should be cancelled.
    */
    handleRequest(request: IHttpRequest): boolean | undefined;
}


export interface IHttpResponseContent
{
    toString(): string;
    toObject<T={}>(): T;
}

export interface IRequestContent
{
    readonly headers: IHttpContentHeaderCollection;
    executeAsync<TResult>(contentWriter: (data?: any) => (TResult | PromiseLike<TResult>)): Promise<TResult>
}


export interface IHttpResponse
{
    readonly ok: boolean;
    readonly status: HttpStatusCode;
    readonly statusText: string;
    readonly headers: IHttpResponseHeaderCollection;
    readonly content: IHttpResponseContent;
}


export interface IHttpRequest
{
    readonly headers: IHttpRequestHeaderCollection;
    readonly method: HttpMethod;
    readonly uri: string;

    content: IRequestContent;

    executeAsync(): Promise<IHttpResponse | undefined>;
}


export interface IHttpClient
{
    readonly filters: IHttpFilter[];
    createRequest(method: HttpMethod, uri: string): IHttpRequest;
}