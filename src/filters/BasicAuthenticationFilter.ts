import { IHttpFilter, IHttpResponse, IHttpRequest } from "../interfaces/HttpClientInterfaces";


export class BasicAuthenticationFilter implements IHttpFilter
{
    private readonly _authHeaderValue: string;

    constructor(username: string, password: string)
    {
        this._authHeaderValue = btoa(`${username}:${password}`);
    }

    canHandleResponse(response: IHttpResponse): boolean
    {
        return false;
    }

    canHandleRequest(request: IHttpRequest): boolean
    {
        return true;
    }

    handleResponse(response: IHttpResponse): boolean | void
    {
        throw new Error("Method not implemented.");
    }

    handleRequest(request: IHttpRequest): boolean | void
    {
        request.headers.authorization = `Basic ${this._authHeaderValue}`;
        request.headers.update('X-TFS-FedAuthRedirect', 'Suppress');
    }

    private _isAuthenticationRequest
}