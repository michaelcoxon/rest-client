import { IHttpResponseContentHandler, IHttpResponse, IHttpResponseContent } from "./interfaces/HttpClientInterfaces";
import { ArgumentException } from "@michaelcoxon/utilities";
import { KnownContentTypes } from "./interfaces/KnownContentTypes";
import { JsonResponseContent } from "./response-content/JsonResponseContent";
import { HttpResponseType } from "./interfaces/HttpClientEnums";



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
            if (handler.canHandle(response))
            {
                return await handler.handleAsync(response);
            }
        }
        throw new ArgumentException('response', 'No registered handlers can handle the response.');
    }
}

export class JsonResponseContentHandler implements IHttpResponseContentHandler
{
    canHandle(response: IHttpResponse): boolean
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












// -- must be last
const defaultHandlers: IHttpResponseContentHandler[] =
    [
        new JsonResponseContentHandler()
    ];

ResponseContentHandlerCollection.setHandlers(defaultHandlers);
