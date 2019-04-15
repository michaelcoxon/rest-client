import { IHttpClient } from './interfaces/HttpClientInterfaces';
import { Url, StringOrUrl } from '@michaelcoxon/utilities';
import { HttpMethod } from './interfaces/HttpClientEnums';
import { JsonResponseContent } from './ResponseContent';
import { ServiceException } from './Exceptions';
import { RequestCancelledException } from './Exceptions';



export abstract class RestService
{
    protected httpClient: IHttpClient;

    constructor(httpClient: IHttpClient)
    {
        this.httpClient = httpClient;
    }
}

export type GetMethodDelegate<TEntity> = {
    (): Promise<TEntity>
};

export type GetMethodDelegateWithParameters<TEntity, TQueryParameters=undefined> = {
    (query: TQueryParameters): Promise<TEntity>
};


export function httpGet<TEntity>(restService: RestService, uri: StringOrUrl): GetMethodDelegate<TEntity>;
export function httpGet<TEntity, TQueryParameters>(restService: RestService, uri: StringOrUrl): GetMethodDelegateWithParameters<TEntity, TQueryParameters>
{
    return function (this: RestService)
    {
        return async (query) =>
        {
            const requestUri = new Url(uri, query);
            const request = this.httpClient.createRequest(HttpMethod.get, requestUri);
            const response = await request.executeAsync();

            if (!response)
            {
                throw new RequestCancelledException(request);
            }

            if (response.cancelled || !response.ok)
            {
                throw new ServiceException(response);
            }

            return ((await response.contentAsync) as JsonResponseContent).toObject<TEntity>();
        }
    }.apply(restService);
}