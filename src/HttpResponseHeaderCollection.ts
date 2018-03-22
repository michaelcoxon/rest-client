import { IHttpResponseHeaderCollection, IHttpHeader, HttpHeaderValue } from "./interfaces/HttpClientInterfaces";
import { KnownHeaderNames } from "./interfaces/KnownHeaderNames";
import { HeaderCollection } from "./HeaderCollection";


export class HttpResponseHeaderCollection extends HeaderCollection implements IHttpResponseHeaderCollection
{

}