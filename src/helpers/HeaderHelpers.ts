import { IContentType } from "../interfaces/HttpClientInterfaces";



export namespace HeaderHelpers
{
    export function contentTypeToString(contentType: IContentType | undefined): string | undefined
    {
        if (contentType)
        {
            if (contentType.encoding)
            {
                return `${contentType.contentType}; charset=${contentType.encoding}`;
            }
            else
            {
                return contentType.contentType;
            }
        }
    }

    export function stringToContentType(strContentType: string | undefined): IContentType | undefined
    {
        if (strContentType)
        {
            const [mediaType, charset] = strContentType.split(';');

            let contentType: IContentType = { contentType: mediaType };

            if (charset)
            {
                const [name, value] = strContentType.split('=');
                contentType.encoding = value;
            }

            return contentType;
        }
    }
}