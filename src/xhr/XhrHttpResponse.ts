import { IHttpResponse, IHttpResponseContent, IHttpResponseHeaderCollection } from "../interfaces/HttpClientInterfaces";
import { HttpStatusCode, HttpResponseType } from "../interfaces/HttpClientEnums";
import { Lazy, Strings, LazyAsync, NotSupportedException } from '@michaelcoxon/utilities';
import { HttpResponseHeaderCollection } from "../HttpResponseHeaderCollection";
import { ResponseContentHandlerCollection } from "../ResponseContentHandlers";


export class XhrHttpResponse implements IHttpResponse
{
    private readonly _lazyOk: Lazy<boolean>;
    private readonly _lazyStatus: Lazy<HttpStatusCode>;
    private readonly _lazyStatusText: Lazy<string>;
    private readonly _lazyHeaders: Lazy<IHttpResponseHeaderCollection>;
    private readonly _lazyContentAsync: LazyAsync<IHttpResponseContent>;
    private readonly _lazyresponse: Lazy<any>;
    private readonly _lazyresponseType: Lazy<HttpResponseType>;

    constructor(xhr: XMLHttpRequest)
    {
        this._lazyOk = new Lazy<boolean>(() => xhr.status >= 200 && xhr.status < 300);
        this._lazyStatus = new Lazy<HttpStatusCode>(() => xhr.status);
        this._lazyStatusText = new Lazy<string>(() => xhr.statusText);
        this._lazyHeaders = new Lazy<IHttpResponseHeaderCollection>(() => XhrHttpResponse._createHttpResponseHeaderCollection(xhr.getAllResponseHeaders()));
        this._lazyContentAsync = new LazyAsync<IHttpResponseContent>(async () => await ResponseContentHandlerCollection.handleAsync(this));
        this._lazyresponse = new Lazy<any>(() => xhr.response);
        this._lazyresponseType = new Lazy<HttpResponseType>(() => XhrHttpResponse._mapResponseType(xhr.responseType));
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


    private static _createHttpResponseHeaderCollection(xhrHeaders: string): IHttpResponseHeaderCollection
    {
        const collection = new HttpResponseHeaderCollection();
        const headers = xhrHeaders.split(Strings.newLine);
        for (const header of headers)
        {
            const [name, value] = Strings.trim(header).split(':', 2);
            collection.add(name, value);
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