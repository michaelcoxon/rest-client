import { HttpStatusCode, HttpMethod, HttpContentEncoding, HttpResponseType, KnownContentTypes } from './HttpClientEnums';
import { Promisable } from '@michaelcoxon/utilities';
import { Url, StringOrUrl } from '../Url';

/** The value of a HTTP header */
export type HttpHeaderValue = string | number | string[] | undefined;

/** Model for the Content-Type header */
export interface IContentType
{
    contentType: KnownContentTypes | string;
    encoding: HttpContentEncoding | string | undefined;
}

/** Model for a header */
export interface IHttpHeader
{
    readonly name: string;
    value: HttpHeaderValue;
}

/** Provides a collection of HTTP headers with helper methods */
export interface IHttpHeaderCollection
{
    /**
     * Adds a header
     * @param name
     * @param value
     */
    add(name: string, value: HttpHeaderValue): void;
    /**
     * Adds a header
     * @param header
     */
    addHeader(header: IHttpHeader): void;
    /**
     * Gets a header
     * @param name
     */
    get(name: string): IHttpHeader | undefined;
    /** Gets all the defined headers */
    getAll(): IHttpHeader[];
    /**
     * removes a header
     * @param name
     */
    remove(name: string): boolean;
    /**
     * Updates a header
     * @param name
     * @param value
     */
    update(name: string, value: HttpHeaderValue): void;
    /**
     * converts the headers to an object
     */
    toObject(): { [name: string]: HttpHeaderValue }
}

/** A collection of headers that only apply to a response */
export interface IHttpResponseHeaderCollection extends IHttpHeaderCollection
{
    /** the content type of the response */
    contentType: IContentType | undefined
}

/** A collection of headers that only apply to a request */
export interface IHttpRequestHeaderCollection extends IHttpHeaderCollection
{
    /** the authorization header on a request */
    authorization: string | undefined
}

/** A collection of headers that only apply to content */
export interface IHttpContentHeaderCollection extends IHttpHeaderCollection
{
    /** the content type of the content */
    contentType: IContentType | undefined
}

/** A filter for requests and responses. can be used to modify the request/response before it is sent/received */
export interface IHttpFilter
{
    /**
     * determin if this filter can handle the response
     * @param response the response
     * @returns Returns true if the filter can handle the response
     */
    canHandleResponseAsync(response: IHttpResponse): Promise<boolean>;
    /**
    * determin if this filter can handle the request
    * @param request the request
    * @returns Returns true if the filter can handle the request
    */
    canHandleRequestAsync(request: IHttpRequest): Promise<boolean>;
    /**
     * handles the response
     * @param response the response
     * @returns Returns true if the response should be cancelled.
     */
    handleResponseAsync(response: IHttpResponse): Promise<boolean | void>;
    /**
    * handles the request
    * @param request the request
    * @returns Returns true if the request should be cancelled.
    */
    handleRequestAsync(request: IHttpRequest): Promise<boolean | void>;
}

/** Interface for response content */
export interface IHttpResponseContent
{

}

/** interface for request content */
export interface IHttpRequestContent
{
    /** the headers of the content */
    readonly headers: IHttpContentHeaderCollection;
    /**
     * Executes the the content and writes the result to the contentWriter
     * @param contentWriter
     */
    executeAsync<TResult>(contentWriter: (data?: any) => Promisable<TResult>): Promise<TResult>
}

/** Defines a response from an IHttpRequest */
export interface IHttpResponse
{
    /** True if the request was cancelled */
    readonly cancelled: boolean;
    /** True if the response has an OK status */
    readonly ok: boolean;
    /** The status code of the response */
    readonly status: HttpStatusCode;
    /** The text that came along with the status code */
    readonly statusText: string;
    /** The headers of the response */
    readonly headers: IHttpResponseHeaderCollection;
    /** The content of the response */
    readonly contentAsync: Promise<IHttpResponseContent>;
    /** The raw response */
    readonly response: any;
    /** The type of content in the response */
    readonly responseType: HttpResponseType;
    /** The request that created the response */
    readonly request: Readonly<IHttpRequest>;
    /** When true, the request should be retried */
    shouldRetry: boolean;
    /**
     * Executes a request that populates the response
     * @param request
     */
    executeAsync(request: IHttpRequest): Promise<void>;
}

/** Wrapper for a HTTP error */
export interface IErrorHttpResponse extends IHttpResponse
{
    /** the error message */
    readonly message: string;
}

/** Defines a HTTP request */
export interface IHttpRequest
{
    /** the headers for the request */
    readonly headers: IHttpRequestHeaderCollection;
    /** the HTTP method for the request */
    readonly method: HttpMethod;
    /** the URI of the request */
    readonly uri: Url;
    /** the body/content of the request */
    content: IHttpRequestContent;
    /** Executes the request and returns the promise of an IHttpResponse */
    executeAsync(): Promise<IHttpResponse | undefined>;
}

/** The Http Client used to make requests */
export interface IHttpClient
{
    /** filters to apply to the request/response */
    readonly filters: IHttpFilter[];
    /**
     * Creates a new request but does not execute it
     * @param method
     * @param uri
     */
    createRequest(method: HttpMethod, uri: StringOrUrl): IHttpRequest;
    /**
     * Creates anew request, executes it and then treats the response as JSON and returnt the resulting object
     * @param uri
     * @throws RequestCancelledException when the request is cancelled
     * @throws ServiceException if the response is cancelled or if there was a status code in the error range
     */
    getObjectAsync<T>(uri: StringOrUrl): Promise<T>;
}

/** Interface for handling response content */
export interface IHttpResponseContentHandler
{
    /**
     * Returns true if this handler can handle the content
     * @param response
     */
    canHandleAsync(response: IHttpResponse): Promise<boolean>;
    /**
     * Handles the content and returns it
     * @param response
     */
    handleAsync(response: IHttpResponse): Promise<IHttpResponseContent>;
}