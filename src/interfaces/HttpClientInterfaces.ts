import { HttpStatusCode, HttpMethod } from "./HttpClientEnums";

export type HttpHeaderValue = string | number | string[] | undefined;


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
    remove(name: string): boolean;
    update(name: string, value: HttpHeaderValue): void;
    getHeaders(): { [name: string]: HttpHeaderValue }
}


export interface IHttpResponseHeaderCollection extends IHeaderCollection
{

}


export interface IHttpRequestHeaderCollection extends IHeaderCollection
{
    authorization?: string
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


export interface IHttpResponseBody
{
    toString(): string;
    toObject<T={}>(): T;
}


export interface IHttpResponse
{
    readonly status: HttpStatusCode;
    readonly headers: IHttpResponseHeaderCollection;
    readonly body: IHttpResponseBody;
}


export interface IHttpRequest
{
    readonly headers: IHttpRequestHeaderCollection;
    readonly method: HttpMethod;
    readonly uri: string;
    executeAsync(): Promise<IHttpResponse>;
}


export interface IHttpClient
{
    readonly filters: IHttpFilter[];
    createRequest(method: HttpMethod, uri: string): IHttpRequest;
}