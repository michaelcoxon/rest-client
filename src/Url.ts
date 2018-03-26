import { NotSupportedException, Strings } from "@michaelcoxon/utilities";

type StringOrUrl = Url | string;

export function stringOrUrlToUrl(stringOrUrl: StringOrUrl): Url
{
    if (stringOrUrl instanceof Url)
    {
        return stringOrUrl;
    }
    else
    {
        return new Url(stringOrUrl);
    }
}

export interface IQueryStringItem
{
    readonly name: string;
    readonly value: any;
}

export class Url
{
    private _url: string;
    private _query: QueryStringCollection;

    constructor(baseUrl: string, relativeUrl?: string)
    {
        this._url = baseUrl;
        this._query = new QueryStringCollection();
        if (relativeUrl)
        {
            this.modify(relativeUrl);
        }
    }

    public modify(relativeUrl: string): void
    {
        if (relativeUrl.startsWith('/'))
        {
            this._modifyRootRelativeUrl(relativeUrl);
        }
        else if (relativeUrl.startsWith('.'))
        {
            this._modifyPathChangeRelativeUrl(relativeUrl);
        }
        else
        {
            const lastSlash = this._url.lastIndexOf('/');
            this._url = this._url.substr(lastSlash) + relativeUrl;
        }
    }

    public get query(): QueryStringCollection
    {
        return this.query;
    }

    public toString(): string
    {
        return this._url + this.query.toString();
    }

    public valueOf(): string
    {
        return this.toString();
    }



    private _modifyPathChangeRelativeUrl(relativeUrl: any): any
    {
        throw new Error("Method not implemented.");
    }

    private _modifyRootRelativeUrl(relativeUrl: any): any
    {
        throw new Error("Method not implemented.");
    }
}


export class QueryStringCollection
{
    private readonly _items: IQueryStringItem[];

    constructor(items: IQueryStringItem[] = [])
    {
        this._items = items;
    }

    public get items(): IQueryStringItem[]
    {
        return this._items;
    }

    public item<T=any>(name: string): T | undefined
    {
        const item = this.items.find(i => i.name === name);
        if (item)
        {
            return item.value as T;
        }
    }

    public toObject(): { [name: string]: any }
    {
        const ret: { [name: string]: any } = {};

        for (const item of this.items)
        {
            ret[item.name] = item.value;
        }

        return ret;
    }

    public toString(): string
    {
        const value = Strings.trimEnd(this.items.reduce((a, c) => `${c.name}=${c.value}&`, ""), '&');
        return `?${value}`;
    }

    public static createFromQueryString(queryString: string)
    {
        let query = queryString;
        if (query.startsWith('?'))
        {
            query = query.substr(1);
        }

        return new QueryStringCollection(
            query
                .split('&')
                .map<IQueryStringItem>(i =>
                {
                    const [name, value] = i.split('=', 2);
                    if (name.indexOf('[') > -1)
                    {
                        throw new NotSupportedException('Arrays and objects in queries are not supported');
                    }
                    return {
                        name: name,
                        value: value,
                    };
                })
        );
    }
}

