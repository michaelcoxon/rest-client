import { IHttpResponseContentHandler, IHttpResponse, IHttpResponseContent } from "./interfaces/HttpClientInterfaces";
import { ArgumentException } from "@michaelcoxon/utilities";
import { JsonResponseContent, PlainTextResponseContent } from "./ResponseContent";
import { HttpResponseType, KnownContentTypes, KnownHeaderNames } from "./interfaces/HttpClientEnums";



export class ResponseContentHandlerCollection
{
    private static _handlers: IHttpResponseContentHandler[];

    public static setHandlers(handlers: IHttpResponseContentHandler[])
    {
        ResponseContentHandlerCollection._handlers = handlers;
    }

    public static async handleAsync(response: IHttpResponse): Promise<IHttpResponseContent>
    {
        for (const handler of ResponseContentHandlerCollection._handlers)
        {
            if (await handler.canHandleAsync(response))
            {
                return await handler.handleAsync(response);
            }
        }
        throw new ArgumentException('response', 'No registered handlers can handle the response.');
    }
}

export class JsonResponseContentHandler implements IHttpResponseContentHandler
{
    public async canHandleAsync(response: IHttpResponse): Promise<boolean>
    {
        // if the responseTyoe is set we can be pretty sure this is ok
        if (response.responseType == HttpResponseType.json)
        {
            return true;
        }
        // otherwise lets parse the content type
        else if (response.headers.contentType)
        {
            switch (response.headers.contentType.contentType)
            {
                case KnownContentTypes.json:
                    return true;
            }
        }
        // other than the above, this is not looking good
        return false;
    }

    public async handleAsync(response: IHttpResponse): Promise<IHttpResponseContent>
    {
        return new JsonResponseContent(response.response);
    }
}

export class PlainTextResponseContentHandler implements IHttpResponseContentHandler
{
    public async canHandleAsync(response: IHttpResponse): Promise<boolean>
    {
        // if the responseTyoe is set we can be pretty sure this is ok
        if (response.responseType == HttpResponseType.text)
        {
            return true;
        }
        // otherwise lets parse the content type
        else if (response.headers.contentType)
        {
            switch (response.headers.contentType.contentType)
            {
                case KnownContentTypes.plainText:
                    return true;
            }
        }
        // other than the above, this is not looking good
        return false;
    }

    public async handleAsync(response: IHttpResponse): Promise<IHttpResponseContent>
    {
        return new PlainTextResponseContent(response.response);
    }
}



export class NoContentResponseContentHandler implements IHttpResponseContentHandler
{
    public async canHandleAsync(response: IHttpResponse): Promise<boolean>
    {
        const contentLength = response.headers.get(KnownHeaderNames.contentLength);

        if (contentLength !== undefined)
        {
            return contentLength.value == 0;
        }
        else if (response.responseType == HttpResponseType.unknown)
        {
            return (response.response as string).length == 0;
        }
        else if (ArrayBuffer !== undefined && response.response instanceof ArrayBuffer)
        {
            return response.response.byteLength == 0;
        }
        else if (Blob !== undefined && response.response instanceof Blob)
        {
            response.response.size == 0;
        }
        else if (Document !== undefined && response.response instanceof Document)
        {
            if (response.response.documentElement === null || response.response.documentElement === undefined)
            {
                return true;
            }
            else
            {
                return response.response.documentElement.outerHTML.length == 0;
            }
        }
        else if (typeof (response.response) === "string")
        {
            return response.response.length == 0;
        }

        // after this we are unsure so just return false
        return false;
    }

    public async handleAsync(response: IHttpResponse): Promise<IHttpResponseContent>
    {
        return {};
    }
}






// -- must be last
const defaultHandlers: IHttpResponseContentHandler[] =
    [
        new JsonResponseContentHandler(),
        new PlainTextResponseContentHandler(),
    ];

ResponseContentHandlerCollection.setHandlers(defaultHandlers);
