import { IHttpRequestHeaderCollection, IHttpHeader, HttpHeaderValue } from "./interfaces/HttpClientInterfaces";
import { KnownHeaderNames } from "./interfaces/KnownHeaderNames";
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
}