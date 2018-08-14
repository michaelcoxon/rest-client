import { IHttpRequest, IHttpFilter, IHttpResponse } from '../interfaces/HttpClientInterfaces';



export namespace FilterHelpers
{
    /** 
     * applies the filters to the request
     * @returns true if the request should be cancelled.
     */
    export async function applyFiltersToRequestAsync(request: IHttpRequest, filters: IHttpFilter[]): Promise<boolean>
    {
        let notCancel = true;
        const filtersCopy = [...filters];
        let filter = filtersCopy.shift();

        while (filter)
        {
            if (await filter.canHandleRequestAsync(request))
            {
                notCancel = notCancel && (!(await filter.handleRequestAsync(request)) || true);
            }

            if (!notCancel)
            {
                break;
            }

            filter = filtersCopy.shift();
        }

        return !notCancel;
    }

    /** 
     * applies the filters to the response
     * @returns true if the response should be cancelled.
     */
    export async function applyFiltersToResponseAsync(response: IHttpResponse, filters: IHttpFilter[]): Promise<boolean>
    {
        let notCancel = true;
        const filtersCopy = [...filters];
        let filter = filtersCopy.shift();

        while (filter)
        {
            if (await filter.canHandleResponseAsync(response))
            {
                notCancel = notCancel && (!(await filter.handleResponseAsync(response)) || true);
            }

            if (!notCancel)
            {
                break;
            }

            filter = filtersCopy.shift();
        }

        return !notCancel;
    }
}