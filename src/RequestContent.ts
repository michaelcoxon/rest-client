import { IRequestContent, IHttpContentHeaderCollection, IHttpRequestHeaderCollection } from "./interfaces/HttpClientInterfaces";
import { HttpContentHeaderCollection } from "./HttpContentHeaderCollection";
import { KnownContentTypes } from "./interfaces/KnownContentTypes";
import { ContentEncoding } from "./interfaces/HttpClientEnums";



export class EmptyRequestContent implements IRequestContent
{
    readonly headers: IHttpContentHeaderCollection;

    constructor(headers: IHttpContentHeaderCollection = new HttpContentHeaderCollection())
    {
        if (!headers.contentType)
        {
            headers.contentType = {
                contentType: KnownContentTypes.plainText,
                encoding: ContentEncoding.utf8,
            };
        }

        this.headers = headers;
    }

    public async executeAsync<TResult>(contentWriter: (data?: any) => TResult | PromiseLike<TResult>): Promise<TResult>
    {
        return await contentWriter();
    }
}

export class JsonRequestContent<T> implements IRequestContent
{
    readonly headers: IHttpContentHeaderCollection;
    readonly object: T;

    constructor(object: T, headers: IHttpContentHeaderCollection = new HttpContentHeaderCollection())
    {
        this.object = object;

        headers.contentType = {
            contentType: KnownContentTypes.json,
            encoding: ContentEncoding.utf8,
        };

        this.headers = headers;
    }

    public async executeAsync<TResult>(contentWriter: (data?: any) => TResult | PromiseLike<TResult>): Promise<TResult>
    {
        const json = JSON.stringify(this.object);
        return await contentWriter(json);
    }
}