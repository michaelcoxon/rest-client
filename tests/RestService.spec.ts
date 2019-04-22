﻿import { expect, assert } from 'chai';
import 'mocha';

import { HttpMethod, HttpStatusCode } from '../src/interfaces/HttpClientEnums';
import { XhrHttpClient } from '../src/xhr/XhrHttpClient';
import { RestService, httpGet, httpPost } from '../src/RestService';
import { BasicAuthenticationFilter, JsonResponseContent, StringRequestContent, MultipartRequestContent, IHttpFilter } from '../src';


interface HttpBinResponse<TData = undefined>
{
    authenticated: boolean,
    user: string,
    url: string,
    data: TData,
    headers:
    {
        Authorization: string,
    }
}


export class MyRestService extends RestService
{
    basicHttpGetRequestAsync = httpGet<HttpBinResponse>(this, 'https://httpbin.org/get');
    basicHttpGetRequestWithBasicAuth2Async = httpGet<HttpBinResponse>(this, 'https://httpbin.org/basic-auth/johndoe/password');
    basicHttpGetRequestWithRedirectsAsync = httpGet<HttpBinResponse>(this, "https://httpbin.org/redirect-to?url=" + encodeURIComponent("https://httpbin.org/get"));

    basicHttpPostStringRequestAsync = httpPost<HttpBinResponse<string>, StringRequestContent>(this, 'https://httpbin.org/post');
}



describe('RestService', function ()
{

    this.timeout(60000); // lets make that timeout crazy

    it('constructs', () =>
    {
        const restService = new MyRestService(new XhrHttpClient());
        assert.isNotNull(restService);
    });

    it('does basic http get request', async () =>
    {
        const restService = new MyRestService(new XhrHttpClient());

        const obj = await restService.basicHttpGetRequestAsync()

        assert(obj.url === "https://httpbin.org/get");
    });

    it('does basic http get request with basic auth', async () =>
    {
        const username = 'johndoe';
        const password = 'password';
        const authHandler = new BasicAuthenticationFilter(username, password);

        const restService = new MyRestService(new XhrHttpClient([authHandler]));

        const obj = await restService.basicHttpGetRequestAsync()
        const creds = atob(obj.headers.Authorization.substring('Basic '.length));

        assert(creds === `${username}:${password}`);
        assert(obj.url === "https://httpbin.org/get");
    });

    it('does basic http get request with basic auth 2', async () =>
    {
        const username = 'johndoe';
        const password = 'password';
        const authHandler = new BasicAuthenticationFilter(username, password);

        const restService = new MyRestService(new XhrHttpClient([authHandler]));

        const obj = await restService.basicHttpGetRequestWithBasicAuth2Async()

        assert(obj.authenticated);
        assert(obj.user === username);
    });

    it('does basic get request with redirects', async () =>
    {
        const restService = new MyRestService(new XhrHttpClient());

        const obj = await restService.basicHttpGetRequestWithRedirectsAsync()

        assert(obj.url === "https://httpbin.org/get", "url was not correct");
    });

    it('does basic http post request', async () =>
    {
        const strContent: string = 'Hello World!';
        const url = 'https://httpbin.org/post';
        const restService = new MyRestService(new XhrHttpClient());

        const obj = await restService.basicHttpPostStringRequestAsync(new StringRequestContent(strContent));

        assert(obj.data, "data is undefined");
        expect(obj.data).equals(strContent, `content not same: '${JSON.stringify(obj.data)}'`);
        expect(obj.url).equals("https://httpbin.org/post", "url was not correct");
    });

    it('does basic multipart http post request', async () =>
    {
        const postContent = { myString: 'Hello World!' };
        const url = 'https://httpbin.org/post';
        const httpClient = new XhrHttpClient();

        const request = httpClient.createRequest(HttpMethod.post, url);
        request.content = new MultipartRequestContent(postContent);

        const response = await request.executeAsync();

        if (!response)
        {
            throw new Error('request was cancelled');
        }

        assert(response.status == HttpStatusCode.ok, "status code should be 200");
        assert(response.ok, "ok should be true");

        const content = (await response.contentAsync) as JsonResponseContent;

        assert(content instanceof JsonResponseContent, "content should be json");

        const obj = content.toObject<{ url: string, form: { [key: string]: any } }>();

        assert(obj.form, "form is undefined");
        expect(obj.form.myString).equals(postContent.myString, `content not same: '${JSON.stringify(obj.form.myString)}'`);
        expect(obj.url).equals("https://httpbin.org/post", "url was not correct");
    });

    it('does basic multipart http post request with 2 properties', async () =>
    {
        const postContent = { myString: 'Hello World!', myNumber: 1 };
        const url = 'https://httpbin.org/post';
        const httpClient = new XhrHttpClient();

        const request = httpClient.createRequest(HttpMethod.post, url);
        request.content = new MultipartRequestContent(postContent);

        const response = await request.executeAsync();

        if (!response)
        {
            throw new Error('request was cancelled');
        }

        assert(response.status == HttpStatusCode.ok, "status code should be 200");
        assert(response.ok, "ok should be true");

        const content = (await response.contentAsync) as JsonResponseContent;

        assert(content instanceof JsonResponseContent, "content should be json");

        const obj = content.toObject<{ url: string, form: { [key: string]: any } }>();

        assert(obj.form, "form is undefined");
        expect(obj.form.myString).equals(postContent.myString, `content not same: '${JSON.stringify(obj.form.myString)}'`);
        expect(obj.form.myNumber).equals(postContent.myNumber.toString(), `content not same: '${JSON.stringify(obj.form.myNumber)}'`);
        expect(obj.url).equals("https://httpbin.org/post", "url was not correct");
    });

    it('does basic handle no connection', async () =>
    {
        const strContent: string = 'Hello World!';
        const url = 'http://localhost:49998/';
        const httpClient = new XhrHttpClient();

        const request = httpClient.createRequest(HttpMethod.post, url);
        request.content = new StringRequestContent(strContent);

        const response = await request.executeAsync();

        if (!response)
        {
            throw new Error('request was cancelled');
        }

        expect(response.status).equals(0, "status code should be 0");
        expect(response.ok).is.false;
    });

});