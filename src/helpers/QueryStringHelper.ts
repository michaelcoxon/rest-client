import { Strings } from '@michaelcoxon/utilities';
import { QueryStringItem } from '../Types';


export namespace QueryStringHelper
{
    export function deserialize(queryString: string): QueryStringItem[]
    {
        let query = queryString;
        if (query.startsWith('?'))
        {
            query = query.substr(1);
        }

        const segments = query.split("&");
        return segments
            .map(s =>
            {
                var components = s.split('=', 2);
                return {
                    name: components[0],
                    value: _parseValue(decodeURIComponent(components[1]))
                };
            });
    }

    export function serialize(obj: {}): string;
    export function serialize(obj: {}, useQuestionMark: boolean): string;
    export function serialize(obj: {}, useQuestionMark: boolean = false): string
    {
        return serializeQueryStringItems(convertObject(obj), useQuestionMark);
    }

    export function serializeQueryStringItems(queryStringItems: QueryStringItem[]): string;
    export function serializeQueryStringItems(queryStringItems: QueryStringItem[], useQuestionMark: boolean): string;
    export function serializeQueryStringItems(queryStringItems: QueryStringItem[], useQuestionMark: boolean = false): string
    {
        return (useQuestionMark ? '?' : Strings.empty) + queryStringItems
            .map(kvp => `${kvp.name}=${encodeURIComponent(kvp.value)}`)
            .join("&");
    }


    export function convertToObject(queryStringItems: QueryStringItem[]): { [key: string]: any }
    {
        const result: { [key: string]: any } = {};

        for (const item of queryStringItems)
        {
            _buildObjectTree(result, item.name, item.value);
        }

        return result;
    }

    export function convertObject(obj: {}): QueryStringItem[];
    export function convertObject(obj: {}, prefix: string): QueryStringItem[];
    export function convertObject(obj: {}, prefix: string = Strings.empty): QueryStringItem[]
    {
        const result: QueryStringItem[] = [];

        for (const key in obj)
        {
            result.push(..._convert(`${prefix}${key}`, obj[key]));
        }

        return result;
    }

    function convertArray(name: string, arr: any[]): QueryStringItem[]
    {
        const result: QueryStringItem[] = [];

        for (let i = 0; i < arr.length; i++)
        {
            const item = arr[i];

            result.push(..._convert(`${name}[${i}]`, item));
        }

        return result;
    }

    function _convert(name: string, value: any): QueryStringItem[]
    {
        const result: QueryStringItem[] = [];

        if (value !== undefined && value != null)
        {
            if (Array.isArray(value))
            {
                result.push(...convertArray(`${name}`, value));
            }
            else if (typeof value === 'object')
            {
                result.push(...convertObject(value, `${name}.`));
            }
            else
            {
                result.push({
                    name: name,
                    value: value
                });
            }
        }

        return result;
    }

    function _parseValue(value: string): any
    {
        //
        // null or empty
        //
        if (Strings.isNullOrEmpty())
        {
            return value;
        }
        //
        // booleans
        //
        else if (value.toLowerCase() === 'true')
        {
            return true;
        }
        else if (value.toLowerCase() === 'false')
        {
            return false;
        }
        // 
        // integer
        //
        else if (/^\d+$/.test(value))
        {
            return parseInt(value);
        }
        // 
        // float
        //
        else if (/^\d+.\d+$/.test(value))
        {
            return parseFloat(value);
        }
        // 
        // string
        //
        else
        {
            return value;
        }
    }

    function _buildObjectTree(result: { [key: string]: any }, name: string, value: any): void
    {
        const keys = name.split('.');
        let current = result;

        for (let i = 0; i < keys.length; i++)
        {
            const currentKey = keys[i];

            if (currentKey.endsWith(']'))
            {
                // array
                const actualKey = currentKey.substring(0, currentKey.indexOf('['));
                current[actualKey] = current[actualKey] || [];

                let index = parseInt(currentKey.split('[', 2)[1]);

                if (isNaN(index))
                {
                    index = current[actualKey].length;
                }

                current = current[actualKey][index] = current[actualKey][index] || (i < keys.length - 1) ? {} : value;
            }
            else
            {
                // object
                current = current[currentKey] = current[currentKey] || (i < keys.length - 1) ? {} : value;
            }
        }
    }
}