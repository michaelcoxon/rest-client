import { NotSupportedException, Strings } from "@michaelcoxon/utilities";
import { QueryStringHelper } from "./helpers/QueryStringHelper";
import { QueryStringItem } from "./Types";

export type StringOrUrl = Url | string;

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

export function stringOrUrlToString(stringOrUrl: StringOrUrl): string
{
    if (stringOrUrl instanceof Url)
    {
        return stringOrUrl.toString();
    }
    else
    {
        return stringOrUrl;
    }
}

export class Url
{
    private _url: string;
    private _query: QueryStringCollection;

    constructor(baseUrl: StringOrUrl, queryStringObject?: { [key: string]: any })
    {
        const [url, query] = stringOrUrlToString(baseUrl).split('?', 2);
        this._url = url;

        if (query === undefined)
        {
            this._query = new QueryStringCollection();
        }
        else
        {
            this._query = QueryStringCollection.createFromQueryString(query);
        }

        if (queryStringObject !== undefined)
        {
            this._query = QueryStringCollection.merge(this._query, QueryStringCollection.createFromObject(queryStringObject));
        }
    }

    public get query(): QueryStringCollection
    {
        return this._query;
    }

    public set query(value: QueryStringCollection)
    {
        this._query = value;
    }

    public toString(): string
    {
        return this._url + this.query.toString();
    }

    public valueOf(): string
    {
        return this.toString();
    }
}


export class QueryStringCollection
{
    private readonly _items: QueryStringItem[];

    constructor(items: QueryStringItem[] = [])
    {
        this._items = items;
    }

    public get items(): QueryStringItem[]
    {
        return this._items;
    }

    public item(name: string): any | undefined
    {
        const items = this.items.filter(i => i.name === name);
        if (items.length > 1)
        {
            return items.map(i => i.value);
        }
        else if (items.length > 0)
        {
            return items[0].value;
        }
    }

    public toObject(): { [name: string]: any }
    {
        return QueryStringHelper.convertToObject(this._items);
    }

    public toString(): string
    {
        return QueryStringHelper.serializeQueryStringItems(this._items, true);
    }

    public static merge(...queryStringCollections: QueryStringCollection[]): QueryStringCollection
    {
        return QueryStringCollection.createFromObject(Object.assign({}, ...queryStringCollections.map(qsc => qsc.toObject())));
    }

    public static createFromQueryString(queryString: string)
    {
        return new QueryStringCollection(QueryStringHelper.deserialize(queryString));
    }

    public static createFromObject(queryStringObject: { [key: string]: any })
    {
        return new QueryStringCollection(QueryStringHelper.convertObject(queryStringObject));
    }
}

