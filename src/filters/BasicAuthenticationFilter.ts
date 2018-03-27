import { IHttpFilter, IHttpResponse, IHttpRequest } from "../interfaces/HttpClientInterfaces";


export class BasicAuthenticationFilter implements IHttpFilter
{
    private readonly _authHeaderValue: string;

    constructor(username: string, password: string)
    {
        this._authHeaderValue = btoa(`${username}:${password}`);
    }

    public async canHandleResponseAsync(response: IHttpResponse): Promise<boolean>
    {
        return false;
    }

    public async canHandleRequestAsync(request: IHttpRequest): Promise<boolean>
    {
        return true;
    }

    public async handleResponseAsync(response: IHttpResponse): Promise<boolean | void>
    {
        throw new Error("Method not implemented.");
    }

    public async handleRequestAsync(request: IHttpRequest): Promise<boolean | void>
    {
        request.headers.authorization = `Basic ${this._authHeaderValue}`;
        request.headers.update('X-TFS-FedAuthRedirect', 'Suppress');
    }
}