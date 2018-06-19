import { IContentType } from '../interfaces/HttpClientInterfaces';
import { Strings } from '@michaelcoxon/utilities';


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
            const [mediaType, charset] = strContentType.split(';')
                .map(i => Strings.trim(i))
                .filter(i => !Strings.isNullOrEmpty(i));

            let contentType: IContentType = {
                contentType: mediaType,
                encoding: undefined
            };

            if (charset)
            {
                const [name, value] = strContentType.split('=')
                    .map(i => Strings.trim(i))
                    .filter(i => !Strings.isNullOrEmpty(i));

                contentType.encoding = value;
            }

            return contentType;
        }
    }

    export function splitHeadersFromString(headers: string): { name: string, value: string }[]
    {
        return headers
            .split(/\r|\n/g)
            .map(h => Strings.trim(h))
            .filter(h => !Strings.isNullOrEmpty(h))
            .map(h =>
            {
                const [name, value] = h.split(':', 2);
                return { name, value };
            });
    }
}