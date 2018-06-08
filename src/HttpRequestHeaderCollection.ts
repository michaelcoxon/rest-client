import { IHttpRequestHeaderCollection, IHttpHeader, HttpHeaderValue } from "./interfaces/HttpClientInterfaces";
import { KnownHeaderNames } from "./interfaces/HttpClientEnums";
import { HeaderCollection } from "./HeaderCollection";




export class HttpRequestHeaderCollection extends HeaderCollection implements IHttpRequestHeaderCollection
{
    public get authorization(): string | undefined
    {
        const header = this.get(KnownHeaderNames.authorization);
        if (header)
        {
            return header.value as string;
        }
    }

    public set authorization(value: string | undefined)
    {
        const header = this.get(KnownHeaderNames.authorization);
        if (header)
        {
            this.update(KnownHeaderNames.authorization, value);
        }
        else
        {
            this.add(KnownHeaderNames.authorization, value);
        }
    }

    public static createFromObject(headers: { [name: string]: HttpHeaderValue }): IHttpRequestHeaderCollection
    {
        const result = new HttpRequestHeaderCollection();

        for (const name in headers)
        {
            result.add(name, headers[name]);
        }

        return result;
    }
}