import { ArgumentException, KeyAlreadyDefinedException } from '@michaelcoxon/utilities';
import { IHttpHeader, HttpHeaderValue, IHeaderCollection } from "./interfaces/HttpClientInterfaces";
import { KnownHeaderNames } from "./interfaces/KnownHeaderNames";




export class HeaderCollection implements IHeaderCollection
{
    private readonly _headers: IHttpHeader[];

    constructor(headers?: IHttpHeader[])
    {
        if (headers)
        {
            this._headers = headers;
        }
        else
        {
            this._headers = [];
        }
    }

    add(name: string, value: HttpHeaderValue): void
    {
        this.addHeader({ name: name, value: value });
    }

    addHeader(header: IHttpHeader): void
    {
        const existingHeader = this.get(header.name);
        if (existingHeader)
        {
            const innerException = new KeyAlreadyDefinedException(existingHeader.name);
            throw new ArgumentException('name', innerException.message, innerException);
        }
        else
        {
            this._headers.push(header);
        }
    }

    get(name: string): IHttpHeader | undefined
    {
        return this._headers.find(i => i.name === name);
    }

    remove(name: string): boolean
    {
        const header = this.get(name);
        if (header)
        {
            const index = this._headers.indexOf(header);
            this._headers.splice(index, 1);
            return true;
        }
        return false;
    }

    update(name: string, value: HttpHeaderValue): void
    {
        const header = this.get(name);
        if (header)
        {
            if (value)
            {
                header.value = value;
            }
            else
            {
                this.remove(name);
            }
        }
    }

    getHeaders(): { [name: string]: HttpHeaderValue }
    {
        const result: { [name: string]: HttpHeaderValue; } = {};

        for (const header of this._headers)
        {
            result[header.name] = header.value;
        }

        return result;
    }
}