//import * as xhrm from "xmlhttprequest";

import { expect, assert } from 'chai';
import 'mocha';


import { XhrHttpClient } from '../src/xhr/XhrHttpClient';
import { BasicAuthenticationFilter } from '../src/filters/BasicAuthenticationFilter';
import { HttpMethod, HttpStatusCode } from '../src/interfaces/HttpClientEnums';
import { JsonResponseContent } from '../src/response-content/JsonResponseContent';
import { JsonRequestContent, StringRequestContent } from '../src/RequestContent';

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
            .createRequest(HttpMethod.get, 'https://httpbin.org/get')
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

        assert(obj.url === "https://httpbin.org/get");
    });

    it('does basic http get request with basic auth', async () =>
    {
        const username = 'johndoe';
        const password = 'password';
        const authHandler = new BasicAuthenticationFilter(username, password);

        const httpClient = new XhrHttpClient([authHandler]);

        const response = await httpClient
            .createRequest(HttpMethod.get, 'https://httpbin.org/get')
            .executeAsync();

        if (!response)
        {
            throw new Error('request was cancelled');
        }

        assert(response.status == HttpStatusCode.ok, "status code should be 200");
        assert(response.ok, "ok should be true");

        const content = (await response.contentAsync) as JsonResponseContent;

        assert(content instanceof JsonResponseContent, "content should be json");

        const obj = content.toObject<{ url: string, headers: { Authorization: string } }>();
        const creds = atob(obj.headers.Authorization.substring('Basic '.length));

        assert(creds === `${username}:${password}`);
        assert(obj.url === "https://httpbin.org/get");
    });

    it('does basic http get request with basic auth 2', async () =>
    {
        const username = 'johndoe';
        const password = 'password';
        const authHandler = new BasicAuthenticationFilter(username, password);
        const url = `https://httpbin.org/basic-auth/${username}/${password}`;

        const httpClient = new XhrHttpClient([authHandler]);

        const response = await httpClient
            .createRequest(HttpMethod.get, url)
            .executeAsync();

        if (!response)
        {
            throw new Error('request was cancelled');
        }

        assert(response.status == HttpStatusCode.ok, "status code should be 200");
        assert(response.ok, "ok should be true");

        const content = (await response.contentAsync) as JsonResponseContent;

        assert(content instanceof JsonResponseContent, "content should be json");

        const obj = content.toObject<{ authenticated: boolean, user: string }>();

        assert(obj.authenticated);
        assert(obj.user === username);
    });

    it('does basic get request with redirects', async () =>
    {
        const url = "https://httpbin.org/redirect-to?url=" + encodeURIComponent("https://httpbin.org/get");
        const httpClient = new XhrHttpClient();

        const response = await httpClient
            .createRequest(HttpMethod.get, url)
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

        assert(obj.url === "https://httpbin.org/get", "url was not correct");
    });

    it('does basic http post request', async () =>
    {
        const strContent: string = 'Hello World!';
        const url = 'http://httpbin.org/post';
        const httpClient = new XhrHttpClient();

        const request = httpClient.createRequest(HttpMethod.post, url);
        request.content = new StringRequestContent(strContent);

        const response = await request.executeAsync();

        if (!response)
        {
            throw new Error('request was cancelled');
        }

        assert(response.status == HttpStatusCode.ok, "status code should be 200");
        assert(response.ok, "ok should be true");

        const content = (await response.contentAsync) as JsonResponseContent;

        assert(content instanceof JsonResponseContent, "content should be json");

        const obj = content.toObject<{ url: string, data: string }>();

        assert(obj.data, "data is undefined");
        assert(obj.data === strContent, `content not same: '${JSON.stringify(obj.data)}'`);
        assert(obj.url === "http://httpbin.org/post", "url was not correct");
    });
});