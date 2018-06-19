import { IHttpResponseContent } from './interfaces/HttpClientInterfaces';



export class JsonResponseContent implements IHttpResponseContent
{
    private readonly _json: string;
    private _object: any;

    constructor(json: string)
    {
        this._json = json;
    }

    toObject<T = {}>(): T
    {
        if (this._object === undefined)
        {
            this._object = JSON.parse(this._json);
        }
        return this._object as T;
    }
}

export class PlainTextResponseContent implements IHttpResponseContent
{
    private readonly _text: string;

    constructor(text: string)
    {
        this._text = text;
    }

    public get content(): string
    {
        return this._text;
    }
}