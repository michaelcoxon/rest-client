import { IHttpRequest, IHttpFilter, IHttpRequestHeaderCollection, IHttpResponse } from "../interfaces/HttpClientInterfaces";
import { HttpMethod } from "../interfaces/HttpClientEnums";
import { HttpRequestHeaderCollection } from "../HttpRequestHeaderCollection";



export class XhrHttpRequest implements IHttpRequest
{
    private readonly _filters: IHttpFilter[];
    public readonly headers: IHttpRequestHeaderCollection;
    public readonly method: HttpMethod;
    public readonly uri: string;

    constructor(method: HttpMethod, uri: string, filters: IHttpFilter[], headers?: IHttpRequestHeaderCollection)
    {
        this.method = method;
        this.uri = uri;
        this._filters = filters;
        this.headers = headers || new HttpRequestHeaderCollection();
    }

    public async executeAsync(): Promise<IHttpResponse>
    {
        throw new Error("Method not implemented.");
    }

    /** 
     * applies the filters to the request
     * @returns true if the request should be cancelled.
     */
    private _applyFilters(): boolean
    {
        let cancel = false;

        const applicableFilters = this._filters.filter(filter => filter.canHandleRequest(this));

        for (const filter of applicableFilters)
        {
            cancel = cancel && (filter.handleRequest(this) || false);
        }

        return cancel;
    }
}