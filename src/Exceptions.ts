import { Exception } from '@michaelcoxon/utilities';
import { IHttpResponse, IHttpRequest } from './interfaces/HttpClientInterfaces';


export class InvalidOperationException extends Exception {
    constructor(message?: string, innerException?: Exception) {
        if (innerException) {
            super(message!, innerException);
        }
        else {
            if (message) {
                super(message);
            }
            else {
                super();
            }
        }
        this.name = 'InvalidOperationException';
    }
}

export class ServiceException extends Exception {
    readonly response: Readonly<IHttpResponse>;

    constructor(response: IHttpResponse);
    constructor(response: IHttpResponse, message: string);
    constructor(response: IHttpResponse, mmessage: string, innerException: Exception);
    constructor(response: IHttpResponse, message?: string, innerException?: Exception) {
        super(message!, innerException!);
        this.name = 'ServiceException';

        this.response = response;
    }
}

export class RequestCancelledException extends Exception {
    readonly request: Readonly<IHttpRequest>;

    constructor(request: IHttpRequest);
    constructor(request: IHttpRequest, message: string);
    constructor(request: IHttpRequest, mmessage: string, innerException: Exception);
    constructor(request: IHttpRequest, message?: string, innerException?: Exception) {
        super(message!, innerException!);
        this.name = 'RequestCancelledException';

        this.request = request;
    }
}