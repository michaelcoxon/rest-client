import { expect, assert } from 'chai';
import 'mocha';

import { QueryStringCollection, IQueryStringItem } from '../src/Url';

describe('QueryStringCollection', () =>
{
    it('constructs', () =>
    {
        const qs = new QueryStringCollection();
    });

    it('createFromQueryString with question mark', () =>
    {
        const name = "myparam";
        const value = "myvalue";
        const queryString = `?${name}=${value}`;

        const query = QueryStringCollection.createFromQueryString(queryString);

        const str = query.toString();
        const obj = query.toObject()
        const items = query.items;

        assert(str === queryString, 'querystring not equal');

        assert(obj[name] === value, 'obj not equal');
        assert(items[0].name === name, 'items name not equal');
        assert(items[0].value === value, 'items value not equal');
        assert(query.item(name) === value, 'item not equal');
    });

});