import { IHttpResponseHeaderCollection, IHttpHeader, HttpHeaderValue, IContentType } from './interfaces/HttpClientInterfaces';
import { KnownHeaderNames } from './interfaces/HttpClientEnums';
import { HeaderCollection } from './HeaderCollection';
import { HeaderHelpers } from './helpers/HeaderHelpers';


export class HttpResponseHeaderCollection extends HeaderCollection implements IHttpResponseHeaderCollection
{
    public get contentType(): IContentType | undefined
    {
        const header = this.get(KnownHeaderNames.contentType);
        if (header)
        {
            return HeaderHelpers.stringToContentType(header.value as string);
        }
    }

    public set contentType(value: IContentType | undefined)
    {
        const header = this.get(KnownHeaderNames.contentType);
        if (header)
        {
            this.update(KnownHeaderNames.contentType, HeaderHelpers.contentTypeToString(value));
        }
        else
        {
            this.add(KnownHeaderNames.contentType, HeaderHelpers.contentTypeToString(value));
        }
    }

    public static createFromObject(headers: { [name: string]: HttpHeaderValue }): IHttpResponseHeaderCollection
    {
        const result = new HttpResponseHeaderCollection();

        for (const name in headers)
        {
            result.add(name, headers[name]);
        }

        return result;
    }
}