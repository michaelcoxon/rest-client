import { IHttpResponse, IHttpResponseContent, IHttpResponseHeaderCollection } from "../interfaces/HttpClientInterfaces";
import { HttpStatusCode } from "../interfaces/HttpClientEnums";



export class XhrHttpResponse implements IHttpResponse
{
    private readonly _xhr: XMLHttpRequest;

    constructor(xhr: XMLHttpRequest)
    {
        this._xhr = xhr;
    }


    get status(): HttpStatusCode;

    get statusText(): string;

    get headers(): IHttpResponseHeaderCollection;

    get content(): IHttpResponseContent;

    get ok(): boolean
    {
        this.
    }
}