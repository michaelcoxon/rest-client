import { expect, assert } from 'chai';
import 'mocha';

import { FilterHelpers } from '../src/helpers/FilterHelpers';
import { IHttpFilter, IHttpRequest } from '../src/interfaces/HttpClientInterfaces';
import { Promises } from '@michaelcoxon/utilities';
import { EmptyRequestContent } from '../src/RequestContent';
import { HttpRequestHeaderCollection } from '../src/HttpRequestHeaderCollection';
import { HttpMethod, Url } from '../src';



describe('FilterHelpers.applyFiltersToRequestAsync', () =>
{
    const emptyRequest: IHttpRequest = {
        content: new EmptyRequestContent(),
        headers: new HttpRequestHeaderCollection(),
        method: HttpMethod.get,
        uri: new Url(""),
        executeAsync: async () => undefined,
    }

    function getFilters(results: number[]): IHttpFilter[]
    {
        return [
            {
                canHandleRequestAsync: async (request) =>
                {
                    return true;
                },
                handleRequestAsync: async (request) =>
                {
                    await Promises.delay(3000);
                    results[0] = new Date().getTime();
                },
                canHandleResponseAsync: async (response) =>
                {
                    assert.fail(undefined, undefined, "canHandleResponseAsync should not be called");
                    return false;
                },
                handleResponseAsync: async (response) =>
                {
                    assert.fail(undefined, undefined, "handleResponseAsync should not be called");
                }
            },
            {
                canHandleRequestAsync: async (request) =>
                {
                    return true;
                },
                handleRequestAsync: async (request) =>
                {
                    await Promises.delay(2000);
                    results[1] = new Date().getTime();
                },
                canHandleResponseAsync: async (response) =>
                {
                    assert.fail(undefined, undefined, "canHandleResponseAsync should not be called");
                    return false;
                },
                handleResponseAsync: async (response) =>
                {
                    assert.fail(undefined, undefined, "handleResponseAsync should not be called");
                }
            },
            {
                canHandleRequestAsync: async (request) =>
                {
                    return true;
                },
                handleRequestAsync: async (request) =>
                {
                    await Promises.delay(1000);
                    results[2] = new Date().getTime();
                },
                canHandleResponseAsync: async (response) =>
                {
                    assert.fail(undefined, undefined, "canHandleResponseAsync should not be called");
                    return false;
                },
                handleResponseAsync: async (response) =>
                {
                    assert.fail(undefined, undefined, "handleResponseAsync should not be called");
                }
            }
        ];
    }

    it('applies the filters in order', async () =>
    {
        const results = new Array<number>(3);
        const filters = getFilters(results);

        const shouldCancel = await FilterHelpers.applyFiltersToRequestAsync(emptyRequest, filters);

        assert.isFalse(shouldCancel);

        assert.isTrue(results[2] > results[1]);
        assert.isTrue(results[1] > results[0]);
    })
        .timeout(7000);
});