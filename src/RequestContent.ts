import { IHttpRequestContent, IHttpContentHeaderCollection, IHttpRequestHeaderCollection } from './interfaces/HttpClientInterfaces';
import { HttpContentHeaderCollection } from './HttpContentHeaderCollection';
import { HttpContentEncoding, KnownContentTypes } from './interfaces/HttpClientEnums';
import { Promisable, isNumber, isUndefinedOrNull, isString, Strings } from '@michaelcoxon/utilities';



export class EmptyRequestContent implements IHttpRequestContent
{
    readonly headers: IHttpContentHeaderCollection;

    constructor(headers: IHttpContentHeaderCollection = new HttpContentHeaderCollection())
    {
        if (!headers.contentType)
        {
            headers.contentType = {
                contentType: KnownContentTypes.plainText,
                encoding: HttpContentEncoding.utf8,
            };
        }

        this.headers = headers;
    }

    public async executeAsync<TResult>(contentWriter: (data?: any) => TResult | PromiseLike<TResult>): Promise<TResult>
    {
        return await contentWriter();
    }
}

export class JsonRequestContent<T> implements IHttpRequestContent
{
    readonly headers: IHttpContentHeaderCollection;
    readonly object: T;

    constructor(object: T, headers: IHttpContentHeaderCollection = new HttpContentHeaderCollection())
    {
        this.object = object;

        headers.contentType = {
            contentType: KnownContentTypes.json,
            encoding: HttpContentEncoding.utf8,
        };

        this.headers = headers;
    }

    public async executeAsync<TResult>(contentWriter: (data?: any) => TResult | PromiseLike<TResult>): Promise<TResult>
    {
        const json = JSON.stringify(this.object);
        return await contentWriter(json);
    }
}

export class StringRequestContent implements IHttpRequestContent
{
    readonly headers: IHttpContentHeaderCollection;
    readonly str: string;

    constructor(str: string, headers: IHttpContentHeaderCollection = new HttpContentHeaderCollection())
    {
        this.str = str;

        headers.contentType = {
            contentType: KnownContentTypes.plainText,
            encoding: HttpContentEncoding.utf8,
        };

        this.headers = headers;
    }

    public async executeAsync<TResult>(contentWriter: (data?: any) => TResult | PromiseLike<TResult>): Promise<TResult>
    {
        return await contentWriter(this.str);
    }
}


export class MultipartRequestContent<T> implements IHttpRequestContent
{
    readonly headers: IHttpContentHeaderCollection;
    readonly object: T;

    constructor(object: T, headers: IHttpContentHeaderCollection = new HttpContentHeaderCollection())
    {
        this.object = object;
        this.headers = headers;
    }

    public async  executeAsync<TResult>(contentWriter: (data?: any) => Promisable<TResult>): Promise<TResult>
    {
        var formData = new FormData();

        MultipartRequestContent.parseObject(Strings.empty, this.object, formData);

        return await contentWriter(formData);
    }

    private static parseObject(key: string, object: any, formData: FormData): void
    {
        if (isUndefinedOrNull(object))
        {
            return;
        }

        if (!Strings.isNullOrEmpty(key) && typeof (object) !== 'object')
        {
            formData.append(key, object.toString());
        }
        else
        {
            const file = object as File;
            if (!Strings.isNullOrEmpty(key) && file.name && file.lastModified && file.size && file.type)
            {
                formData.append(key, file);
            }
            else
            {
                for (var itemKey in object)
                {
                    const newKey = Strings.isNullOrEmpty(key)
                        ? itemKey
                        : `${key}.${itemKey}`;

                    MultipartRequestContent.parseObject(newKey, object[itemKey], formData);
                }
            }
        }
    }
}