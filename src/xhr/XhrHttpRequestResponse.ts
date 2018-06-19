import { IHttpRequest, IHttpFilter, IHttpRequestHeaderCollection, IHttpResponse, IHttpRequestContent, IHttpResponseHeaderCollection, IHttpResponseContent, IErrorHttpResponse } from "../interfaces/HttpClientInterfaces";
import { HttpMethod, HttpStatusCode, HttpResponseType, KnownHeaderNames } from "../interfaces/HttpClientEnums";
import { HttpRequestHeaderCollection } from "../HttpRequestHeaderCollection";
import { HttpResponseHeaderCollection } from "../HttpResponseHeaderCollection";
import { InvalidOperationException } from "../Exceptions";
import { EmptyRequestContent } from "../RequestContent";
import { Lazy, LazyAsync, Strings, NotSupportedException, ArgumentException } from "@michaelcoxon/utilities";
import { ResponseContentHandlerCollection } from "../ResponseContentHandlers";
import { Url, stringOrUrlToUrl, StringOrUrl } from "../Url";
import { HeaderHelpers } from '..';

const MUST_EXECUTE_RESPONSE_FIRST_MESSAGE = "Must execute response first";

export class XhrHttpRequest implements IHttpRequest
{
    private readonly _filters: IHttpFilter[];
    private readonly _timeout: number;

    // these bools are provided so that the request cant be executed multiple times.

    /** true when the request is cancelled */
    private _cancelled: boolean;
    /** true when the request is preparing */
    private _prepared: boolean;
    /** true when the request has executed */
    private _executed: boolean;

    public readonly headers: IHttpRequestHeaderCollection;
    public readonly method: HttpMethod;
    public readonly uri: Url;
    public readonly xhr: XMLHttpRequest;

    public content: IHttpRequestContent;

    constructor(
        method: HttpMethod,
        uri: StringOrUrl,
        filters: IHttpFilter[] = [],
        headers: IHttpRequestHeaderCollection,
        ignoreCache: boolean,
        timeout: number,
    )
    {
        this.method = method;
        this.uri = stringOrUrlToUrl(uri);
        this._filters = filters;
        this.headers = headers;
        this._timeout = timeout;

        this.xhr = new XMLHttpRequest();
        this._cancelled = false;
        this._prepared = false;
        this._executed = false;

        this.content = new EmptyRequestContent();

        if (ignoreCache)
        {
            this.headers.add(KnownHeaderNames.cacheControl, 'no-cache');
        }
    }

    /** returns true if the request was cancelled */
    public get cancelled(): boolean
    {
        return this._cancelled;
    }

    public executeAsync(): Promise<IHttpResponse | undefined>
    {
        if (this._executed)
        {
            throw new InvalidOperationException('Request already executed. Create a new Request');
        }
        this._executed = true;

        return new Promise(async (resolve, reject) =>
        {
            try
            {
                // prepare the request
                await this._prepareRequestAsync();

                this.xhr.onload = evt =>
                {
                    const response = this._prepareResponse();
                    response.executeAsync(this);
                    resolve(response);
                };

                this.xhr.onerror = evt =>
                {
                    const response = this._prepareErrorResponse();
                    response.executeAsync(this);
                    resolve(response);
                };

                this.xhr.ontimeout = evt =>
                {
                    const response = this._prepareTimeoutResponse();
                    response.executeAsync(this);
                    resolve(response);
                };

                let sent = false;

                //send the content
                await this.content.executeAsync((data) =>
                {
                    if (sent)
                    {
                        throw new InvalidOperationException("can only call the content writer once");
                    }
                    sent = true;
                    this.xhr.send(data);
                });
            }
            catch (ex)
            {
                reject(ex);
            }
        });
    }

    private async _prepareRequestAsync(): Promise<void>
    {
        if (this._prepared)
        {
            throw new InvalidOperationException('Request already prepared. Create a new Request');
        }
        this._prepared = true;

        this.xhr.open(this.method, this.uri.toString());

        if (!this.content)
        {
            this.content = new EmptyRequestContent();
        }

        this._cancelled = await this._applyFiltersAsync();

        // if we cancelled the request then lets bail out here
        if (!this._cancelled)
        {
            // start applying parameters to xhr now
            this._setHeaders();

            this.xhr.timeout = this._timeout;
        }
    }

    /** 
     * applies the filters to the request
     * @returns true if the request should be cancelled.
     */
    private async _applyFiltersAsync(): Promise<boolean>
    {
        let notCancel = true;

        for (const filter of this._filters)
        {
            if (await filter.canHandleRequestAsync(this))
            {
                notCancel = notCancel && (!(await filter.handleRequestAsync(this)) || true);
            }

            if (!notCancel)
            {
                break;
            }
        }

        return !notCancel;
    }

    private _setHeaders(): void
    {
        // content can override the request headers
        const headers = Object.assign(
            {},
            this.headers.toObject(),
            this.content.headers.toObject());


        const names = Object.getOwnPropertyNames(headers);

        for (const name of names)
        {
            const headerValue = headers[name];
            if (headerValue != undefined)
            {
                if (Array.isArray(headerValue))
                {
                    for (const value in headerValue)
                    {
                        this.xhr.setRequestHeader(name, value);
                    }
                }
                else
                {
                    this.xhr.setRequestHeader(name, headerValue.toString());
                }
            }
        }
    }

    private _prepareResponse(): XhrHttpResponse
    {
        return new XhrHttpResponse(this._filters);
    }

    private _prepareErrorResponse(): XhrHttpResponse
    {
        return new XhrErrorHttpResponse('There was a problem with the request', this._filters);
    }

    private _prepareTimeoutResponse(): XhrHttpResponse
    {
        return new XhrErrorHttpResponse(`The request timed out after ${this._timeout} seconds`, this._filters);
    }
}



export class XhrHttpResponse implements IHttpResponse
{
    private readonly _filters: IHttpFilter[];

    private _cancelled: boolean;
    private _request?: XhrHttpRequest;

    private _lazyOk: Lazy<boolean>;
    private _lazyStatus: Lazy<HttpStatusCode>;
    private _lazyStatusText: Lazy<string>;
    private _lazyHeaders: Lazy<IHttpResponseHeaderCollection>;
    private _lazyContentAsync: LazyAsync<IHttpResponseContent>;
    private _lazyresponse: Lazy<any>;
    private _lazyresponseType: Lazy<HttpResponseType>;

    constructor(filters: IHttpFilter[] = [])
    {
        this._filters = filters;
        this._cancelled = false;

        const lazyException = new Lazy(() => { throw new InvalidOperationException(MUST_EXECUTE_RESPONSE_FIRST_MESSAGE) });

        this._lazyOk = lazyException;
        this._lazyStatus = lazyException;
        this._lazyStatusText = lazyException;
        this._lazyHeaders = lazyException;
        this._lazyresponse = lazyException;
        this._lazyresponseType = lazyException;
        this._lazyContentAsync = new LazyAsync(async () => { throw new InvalidOperationException(MUST_EXECUTE_RESPONSE_FIRST_MESSAGE) });
    }

    public shouldRetry: boolean = false;


    get cancelled(): boolean
    {
        return this._cancelled;
    }

    public get request(): Readonly<IHttpRequest>
    {
        if (!this._request)
        {
            throw new InvalidOperationException(MUST_EXECUTE_RESPONSE_FIRST_MESSAGE);
        }
        return this._request;
    }

    get response(): any
    {
        return this._lazyresponse.value;
    }

    get responseType(): HttpResponseType
    {
        return this._lazyresponseType.value;
    }

    get status(): HttpStatusCode
    {
        return this._lazyStatus.value;
    }

    get statusText(): string
    {
        return this._lazyStatusText.value;
    }

    get headers(): IHttpResponseHeaderCollection
    {
        return this._lazyHeaders.value;
    }

    get contentAsync(): Promise<IHttpResponseContent>
    {
        return this._lazyContentAsync.value;
    }

    get ok(): boolean
    {
        return this._lazyOk.value;
    }

    public async executeAsync(request: IHttpRequest): Promise<void>
    {
        if (!(request instanceof XhrHttpRequest))
        {
            throw new ArgumentException('request', 'request must be of type XhrHttpRequest');
        }

        this._request = request;

        this._lazyOk = new Lazy<boolean>(() => request.xhr.status >= 200 && request.xhr.status < 300);
        this._lazyStatus = new Lazy<HttpStatusCode>(() => request.xhr.status);
        this._lazyStatusText = new Lazy<string>(() => request.xhr.statusText);
        this._lazyHeaders = new Lazy<IHttpResponseHeaderCollection>(() => XhrHttpResponse._createHttpResponseHeaderCollection(request.xhr.getAllResponseHeaders()));
        this._lazyresponse = new Lazy<any>(() => request.xhr.response);
        this._lazyresponseType = new Lazy<HttpResponseType>(() => XhrHttpResponse._mapResponseType(request.xhr.responseType));
        this._lazyContentAsync = new LazyAsync<IHttpResponseContent>(async () => await ResponseContentHandlerCollection.handleAsync(this));

        this._cancelled = await this._applyFiltersAsync();
    }

    /** 
     * applies the filters to the response
     * @returns true if the response should be cancelled.
     */
    private async _applyFiltersAsync(): Promise<boolean>
    {
        let notCancel = true;

        for (const filter of this._filters)
        {
            if (await filter.canHandleResponseAsync(this))
            {
                notCancel = notCancel && (!(await filter.handleResponseAsync(this)) || true);
            }

            if (!notCancel)
            {
                break;
            }
        }

        return !notCancel;
    }

    private static _createHttpResponseHeaderCollection(xhrHeaders: string): IHttpResponseHeaderCollection
    {
        const collection = new HttpResponseHeaderCollection();

        for (const header of HeaderHelpers.splitHeadersFromString(xhrHeaders))
        {
            collection.add(header.name, header.value);
        }

        return collection;
    }

    private static _mapResponseType(xhrResponseType: XMLHttpRequestResponseType): HttpResponseType
    {
        switch (xhrResponseType)
        {
            case "": return HttpResponseType.unknown;
            case "arraybuffer": return HttpResponseType.arrayBuffer;
            case "blob": return HttpResponseType.blob;
            case "document": return HttpResponseType.document;
            case "json": return HttpResponseType.json;
            case "text": return HttpResponseType.text;
            default:
                throw new NotSupportedException(`The response type '${xhrResponseType}' is not supported.`);
        }
    }
}


export class XhrErrorHttpResponse extends XhrHttpResponse implements IErrorHttpResponse
{
    public readonly message: string;

    constructor(message: string, filters: IHttpFilter[])
    {
        super(filters);
        this.message = message;
    }
}