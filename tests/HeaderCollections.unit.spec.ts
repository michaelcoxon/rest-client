import { expect, assert } from 'chai';
import 'mocha';
import { HeaderCollection } from '../src/HeaderCollection';
import { IHttpHeader, IHttpContentHeaderCollection } from '../src/interfaces/HttpClientInterfaces';
import { KnownHeaderNames, KnownContentTypes, HttpContentEncoding } from '../src/interfaces/HttpClientEnums';
import { HttpContentHeaderCollection } from '../src/HttpContentHeaderCollection';
import { HttpRequestHeaderCollection } from '../src/HttpRequestHeaderCollection';
import { HttpResponseHeaderCollection } from '../src/HttpResponseHeaderCollection';

describe('HeaderCollection.constructor', () =>
{
    it('constructs default', () =>
    {
        const hc = new HeaderCollection();
    });

    it('constructs with headers', () =>
    {
        const headers: IHttpHeader[] = [];

        headers.push({
            name: KnownHeaderNames.accept,
            value: KnownContentTypes.json,
        });

        const hc = new HeaderCollection(...headers);

        assert.equal(hc.get(KnownHeaderNames.accept)!.value, KnownContentTypes.json);
    });
});

describe('HeaderCollection.add', () =>
{
    it('adds the header', () =>
    {
        const hc = new HeaderCollection();

        hc.add(KnownHeaderNames.accept, KnownContentTypes.json);

        assert.equal(hc.get(KnownHeaderNames.accept)!.value, KnownContentTypes.json);
    });

    it('throws if the header is already defined', (done) =>
    {
        try
        {
            const hc = new HeaderCollection();

            hc.add(KnownHeaderNames.accept, KnownContentTypes.json);
            hc.add(KnownHeaderNames.accept, KnownContentTypes.json);

            assert.fail();
        }
        catch{
            done();
        }
    });
});

describe('HeaderCollection.addHeader', () =>
{
    it('adds the header', () =>
    {
        const header: IHttpHeader = {
            name: KnownHeaderNames.accept,
            value: KnownContentTypes.json,
        };

        const hc = new HeaderCollection();

        hc.addHeader(header);

        assert.equal(hc.get(KnownHeaderNames.accept)!.value, KnownContentTypes.json);
    });

    it('throws if the header is already defined', (done) =>
    {
        try
        {
            const header: IHttpHeader = {
                name: KnownHeaderNames.accept,
                value: KnownContentTypes.json,
            };

            const hc = new HeaderCollection();

            hc.addHeader(header);
            hc.addHeader(header);

            assert.fail();
        }
        catch{
            done();
        }
    });
});

describe('HeaderCollection.get', () =>
{
    it('gets the header', () =>
    {
        const hc = new HeaderCollection();

        hc.add(KnownHeaderNames.accept, KnownContentTypes.json);

        const header = hc.get(KnownHeaderNames.accept)

        assert.equal(header!.value, KnownContentTypes.json);
    });

    it('returns undefined if the header does not exist', () =>
    {
        const hc = new HeaderCollection();
        const header = hc.get(KnownHeaderNames.accept)

        assert.isUndefined(header);
    });

    it('does not return null if the header does not exist', () =>
    {
        const hc = new HeaderCollection();
        const header = hc.get(KnownHeaderNames.accept)

        assert.isNotNull(header);
    });
});

describe('HeaderCollection.getAll', () =>
{
    it('gets all the headers', () =>
    {
        const hc = new HeaderCollection();

        hc.add(KnownHeaderNames.accept, KnownContentTypes.json);
        hc.add(KnownHeaderNames.authorization, "Bearer 123456");
        hc.add(KnownHeaderNames.contentLength, "50");

        const headers = hc.getAll();

        assert.equal(headers[0].value, KnownContentTypes.json);
        assert.equal(headers[1].value, "Bearer 123456");
        assert.equal(headers[2].value, "50");
    });

    it('returns empty if no headers', () =>
    {
        const hc = new HeaderCollection();

        assert.isEmpty(hc.getAll());
    });
});

describe('HeaderCollection.remove', () =>
{
    it('removes the header and returns true', () =>
    {
        const hc = new HeaderCollection();

        hc.add(KnownHeaderNames.accept, KnownContentTypes.json);
        hc.add(KnownHeaderNames.authorization, "Bearer 123456");
        hc.add(KnownHeaderNames.contentLength, "50");

        const result = hc.remove(KnownHeaderNames.authorization);

        assert.isTrue(result);

        const headers = hc.getAll();

        assert.equal(headers[0].value, KnownContentTypes.json);
        assert.equal(headers[1].value, "50");
    });

    it('returns false if the header does not exist', () =>
    {
        const hc = new HeaderCollection();

        hc.add(KnownHeaderNames.accept, KnownContentTypes.json);
        hc.add(KnownHeaderNames.authorization, "Bearer 123456");
        hc.add(KnownHeaderNames.contentLength, "50");

        const result = hc.remove(KnownHeaderNames.cacheControl);

        assert.isFalse(result);

        const headers = hc.getAll();

        assert.equal(headers[0].value, KnownContentTypes.json);
        assert.equal(headers[1].value, "Bearer 123456");
        assert.equal(headers[2].value, "50");
    });
});

describe('HeaderCollection.update', () =>
{
    it('updates the header', () =>
    {
        const hc = new HeaderCollection();

        hc.add(KnownHeaderNames.accept, KnownContentTypes.json);
        assert.equal(hc.get(KnownHeaderNames.accept)!.value, KnownContentTypes.json);

        hc.update(KnownHeaderNames.accept, KnownContentTypes.html);

        assert.equal(hc.getAll().length, 1);
        assert.equal(hc.get(KnownHeaderNames.accept)!.value, KnownContentTypes.html);
    });

    it('adds the header if it is not already in the collection', () =>
    {
        const hc = new HeaderCollection();

        hc.add(KnownHeaderNames.accept, KnownContentTypes.json);
        assert.equal(hc.get(KnownHeaderNames.accept)!.value, KnownContentTypes.json);

        hc.update(KnownHeaderNames.contentType, KnownContentTypes.html);

        assert.equal(hc.getAll().length, 2);
        assert.equal(hc.get(KnownHeaderNames.accept)!.value, KnownContentTypes.json);
        assert.equal(hc.get(KnownHeaderNames.contentType)!.value, KnownContentTypes.html);
    });
});

describe('HeaderCollection.toObject', () =>
{
    it('creates an object from the headers', () =>
    {
        const hc = new HeaderCollection();

        hc.add(KnownHeaderNames.accept, KnownContentTypes.json);
        hc.add(KnownHeaderNames.contentType, KnownContentTypes.html);

        const result = hc.toObject();

        assert.equal(result[KnownHeaderNames.accept], KnownContentTypes.json);
        assert.equal(result[KnownHeaderNames.contentType], KnownContentTypes.html);
    });
});

describe('HeaderCollection.createFromObject', () =>
{
    it('creates headers from an object', () =>
    {
        const obj = {
            [KnownHeaderNames.accept]: KnownContentTypes.json,
            [KnownHeaderNames.contentType]: KnownContentTypes.html,
        };

        const result = HeaderCollection.createFromObject(obj);

        assert.equal(result.get(KnownHeaderNames.accept)!.value, KnownContentTypes.json);
        assert.equal(result.get(KnownHeaderNames.contentType)!.value, KnownContentTypes.html);
    });
});

describe('HttpContentHeaderCollection.constructor', () =>
{
    it('constructs default', () =>
    {
        const hc = new HttpContentHeaderCollection();
    });

    it('constructs with headers', () =>
    {
        const headers: IHttpHeader[] = [];

        headers.push({
            name: KnownHeaderNames.contentType,
            value: KnownContentTypes.json,
        });

        const hc = new HttpContentHeaderCollection(...headers);

        assert.equal(hc.get(KnownHeaderNames.contentType)!.value, KnownContentTypes.json);
        assert.equal(hc.contentType!.contentType, KnownContentTypes.json);
    });
});

describe('HttpContentHeaderCollection.contentType', () =>
{
    it('sets and gets the content type', () =>
    {
        const hc = new HttpContentHeaderCollection();

        hc.contentType = {
            contentType: KnownContentTypes.json,
            encoding: HttpContentEncoding.utf8,
        };

        assert.equal(hc.get(KnownHeaderNames.contentType)!.value, `${KnownContentTypes.json}; charset=${HttpContentEncoding.utf8}`);
        assert.equal(hc.contentType!.contentType, KnownContentTypes.json);
        assert.equal(hc.contentType!.encoding, HttpContentEncoding.utf8);
    });
});

describe('HttpContentHeaderCollection.createFromObject', () =>
{
    it('creates headers from an object', () =>
    {
        const obj = {
            [KnownHeaderNames.accept]: KnownContentTypes.json,
            [KnownHeaderNames.contentType]: KnownContentTypes.html,
        };

        const result = HttpContentHeaderCollection.createFromObject(obj);

        assert.equal(result.get(KnownHeaderNames.accept)!.value, KnownContentTypes.json);
        assert.equal(result.get(KnownHeaderNames.contentType)!.value, KnownContentTypes.html);
        assert.equal(result.contentType!.contentType, KnownContentTypes.html);
    });
});

describe('HttpRequestHeaderCollection.constructor', () =>
{
    it('constructs default', () =>
    {
        const hc = new HttpRequestHeaderCollection();
    });

    it('constructs with headers', () =>
    {
        const headers: IHttpHeader[] = [];

        headers.push({
            name: KnownHeaderNames.authorization,
            value: "Bearer 123456",
        });

        const hc = new HttpRequestHeaderCollection(...headers);

        assert.equal(hc.get(KnownHeaderNames.authorization)!.value, "Bearer 123456");
        assert.equal(hc.authorization, "Bearer 123456");
    });
});

describe('HttpRequestHeaderCollection.contentType', () =>
{
    it('sets and gets the content type', () =>
    {
        const hc = new HttpRequestHeaderCollection();

        hc.authorization = "Bearer 123456";

        assert.equal(hc.get(KnownHeaderNames.authorization)!.value, "Bearer 123456");
        assert.equal(hc.authorization, "Bearer 123456");
    });
});

describe('HttpRequestHeaderCollection.createFromObject', () =>
{
    it('creates headers from an object', () =>
    {
        const obj = {
            [KnownHeaderNames.accept]: KnownContentTypes.json,
            [KnownHeaderNames.authorization]: "Bearer 123456",
        };

        const result = HttpRequestHeaderCollection.createFromObject(obj);

        assert.equal(result.get(KnownHeaderNames.accept)!.value, KnownContentTypes.json);
        assert.equal(result.get(KnownHeaderNames.authorization)!.value, "Bearer 123456");
        assert.equal(result.authorization, "Bearer 123456");
    });
});

describe('HttpResponseHeaderCollection.constructor', () =>
{
    it('constructs default', () =>
    {
        const hc = new HttpResponseHeaderCollection();
    });

    it('constructs with headers', () =>
    {
        const headers: IHttpHeader[] = [];

        headers.push({
            name: KnownHeaderNames.contentType,
            value: KnownContentTypes.json,
        });

        const hc = new HttpResponseHeaderCollection(...headers);

        assert.equal(hc.get(KnownHeaderNames.contentType)!.value, KnownContentTypes.json);
        assert.equal(hc.contentType!.contentType, KnownContentTypes.json);
    });
});

describe('HttpResponseHeaderCollection.contentType', () =>
{
    it('sets and gets the content type', () =>
    {
        const hc = new HttpResponseHeaderCollection();

        hc.contentType = {
            contentType: KnownContentTypes.json,
            encoding: HttpContentEncoding.utf8,
        };

        assert.equal(hc.get(KnownHeaderNames.contentType)!.value, `${KnownContentTypes.json}; charset=${HttpContentEncoding.utf8}`);
        assert.equal(hc.contentType!.contentType, KnownContentTypes.json);
        assert.equal(hc.contentType!.encoding, HttpContentEncoding.utf8);
    });
});

describe('HttpResponseHeaderCollection.createFromObject', () =>
{
    it('creates headers from an object', () =>
    {
        const obj = {
            [KnownHeaderNames.contentLength]: 50,
            [KnownHeaderNames.contentType]: KnownContentTypes.html,
        };

        const result = HttpResponseHeaderCollection.createFromObject(obj);

        assert.equal(result.get(KnownHeaderNames.contentLength)!.value, 50);
        assert.equal(result.get(KnownHeaderNames.contentType)!.value, KnownContentTypes.html);
        assert.equal(result.contentType!.contentType, KnownContentTypes.html);
    });
});
