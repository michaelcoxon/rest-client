import { IHttpRequest, IHttpFilter, IHttpRequestHeaderCollection, IHttpResponse, IRequestContent } from "../interfaces/HttpClientInterfaces";
import { HttpMethod, HttpStatusCode } from "../interfaces/HttpClientEnums";
import { HttpRequestHeaderCollection } from "../HttpRequestHeaderCollection";
import { HttpResponseHeaderCollection } from "../HttpResponseHeaderCollection";
import { KnownHeaderNames } from "../interfaces/KnownHeaderNames";
import { InvalidOperationException } from "../Exceptions";
import { EmptyRequestContent } from "../RequestContent";



export class XhrHttpRequest implements IHttpRequest
{
    private readonly _filters: IHttpFilter[];
    private readonly _xhr: XMLHttpRequest;
    private readonly _timeout: number;

    private _cancelled: boolean;
    private _prepared: boolean;
    private _executed: boolean;

    public readonly headers: IHttpRequestHeaderCollection;
    public readonly method: HttpMethod;
    public readonly uri: string;

    public content: IRequestContent;

    constructor(
        method: HttpMethod,
        uri: string,
        filters: IHttpFilter[] = [],
        headers: IHttpRequestHeaderCollection = new HttpRequestHeaderCollection([{
            name: KnownHeaderNames.accept,
            value: "application/json, text/javascript, text/plain"
        }]),
        ignoreCache: boolean = false,
        timeout: number = 5000,
    )
    {
        this.method = method;
        this.uri = uri;
        this._filters = filters;
        this.headers = headers;
        this._timeout = timeout;

        this._xhr = new XMLHttpRequest();
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
                this._prepareRequest();

                this._xhr.onload = evt =>
                {
                    resolve(this._prepareResponse());
                };

                this._xhr.onerror = evt =>
                {
                    resolve(this._prepareErrorResponse());
                };

                this._xhr.ontimeout = evt =>
                {
                    resolve(this._prepareTimeoutResponse());
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
                    this._xhr.send(data);
                });
            }
            catch (ex)
            {
                reject(ex);
            }
        });
    }

    private _prepareRequest(): void
    {
        if (this._prepared)
        {
            throw new InvalidOperationException('Request already prepared. Create a new Request');
        }
        this._prepared = true;

        this._xhr.open(this.method, this.uri);

        if (!this.content)
        {
            this.content = new EmptyRequestContent();
        }

        this._cancelled = this._applyFilters();

        // if we cancelled the request then lets bail out here
        if (!this._cancelled)
        {
            // start applying parameters to xhr now
            this._setHeaders();

            this._xhr.timeout = this._timeout;
        }
    }

    /** 
     * applies the filters to the request
     * @returns true if the request should be cancelled.
     */
    private _applyFilters(): boolean
    {
        let cancel = false;

        for (const filter of this._filters)
        {
            if (filter.canHandleRequest(this))
            {
                cancel = cancel && (filter.handleRequest(this) || false);
            }

            if (cancel)
            {
                break;
            }
        }

        return cancel;
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
                        this._xhr.setRequestHeader(name, value);
                    }
                }
                else
                {
                    this._xhr.setRequestHeader(name, headerValue.toString());
                }
            }
        }
    }

    private _prepareResponse(): IHttpResponse
    {

    }

    private _prepareErrorResponse(): IHttpResponse
    {

    }

    private _prepareTimeoutResponse(): IHttpResponse
    {

    }
}