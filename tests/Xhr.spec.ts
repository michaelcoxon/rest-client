//import * as xhrm from "xmlhttprequest";

import { expect, assert } from 'chai';
import 'mocha';


import { XhrHttpClient } from '../src/xhr/XhrHttpClient';
import { HttpMethod, HttpStatusCode } from '../src/interfaces/HttpClientEnums';
import { JsonResponseContent } from '../src/response-content/JsonResponseContent';

//(<any>global).XMLHttpRequest = xhrm.XMLHttpRequest


describe('XhrHttpClient', () =>
{
    it('constructs', () =>
    {
        const httpClient = new XhrHttpClient();
    });

    it('does basic http get request', async () =>
    {
        const httpClient = new XhrHttpClient();

        const response = await httpClient
            .createRequest(HttpMethod.get, 'http://httpbin.org/get')
            .executeAsync();

        if (!response)
        {
            throw new Error('request was cancelled');
        }

        assert(response.status == HttpStatusCode.ok, "status code should be 200");
        assert(response.ok, "ok should be true");

        const content = (await response.contentAsync) as JsonResponseContent;

        assert(content instanceof JsonResponseContent, "content should be json");

        const obj = content.toObject<{ url: string }>();

        assert(obj.url === "http://httpbin.org/get");
    });
});