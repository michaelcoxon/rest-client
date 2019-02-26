import { expect, assert } from 'chai';
import 'mocha';

import { QueryStringCollection } from '../src/Url';

describe('QueryStringCollection.constructor', () => {
    it('constructs', () => {
        const qs = new QueryStringCollection();
    });
});

describe('QueryStringCollection.createFromQueryString', () => {
    it('constructs', () => {
        const qs = new QueryStringCollection();
    });

    it('with question mark', () => {
        const name = "myparam";
        const value = "myvalue";
        const queryString = `?${name}=${encodeURIComponent(value)}`;

        const query = QueryStringCollection.createFromQueryString(queryString);

        const str = query.toString();
        const obj = query.toObject()
        const items = query.items;

        assert.equal(str, queryString, 'querystring not equal');

        assert.equal(obj[name], value, 'obj not equal');
        assert.equal(items[0].name, name, 'items name not equal');
        assert.equal(items[0].value, value, 'items value not equal');
        assert.equal(query.item(name), value, 'item not equal');
    });

    it('without question mark', () => {
        const name = "myparam";
        const value = "myvalue";
        const queryString = `${name}=${encodeURIComponent(value)}`;

        const query = QueryStringCollection.createFromQueryString(queryString);

        const str = query.toString();
        const obj = query.toObject()
        const items = query.items;

        assert.equal(str, '?' + queryString, 'querystring not equal');

        assert.equal(obj[name], value, 'obj not equal');
        assert.equal(items[0].name, name, 'items name not equal');
        assert.equal(items[0].value, value, 'items value not equal');
        assert.equal(query.item(name), value, 'item not equal');
    });


    it('array', () => {
        const name = "myparam";
        const value = "myvalue";
        const queryString = `${name}[]=${encodeURIComponent(value + 1)}&${name}[]=${encodeURIComponent(value + 2)}&${name}[]=${encodeURIComponent(value + 3)}`;

        const query = QueryStringCollection.createFromQueryString(queryString);

        const str = query.toString();
        const obj = query.toObject();
        const items = query.items;

        assert.equal(str, '?' + queryString, 'querystring not equal');

        assert.equal(obj[name][0], value + 1, 'obj 1 not equal');
        assert.equal(obj[name][1], value + 2, 'obj 2 not equal');
        assert.equal(obj[name][2], value + 3, 'obj 3 not equal');
        assert.equal(items[0].name, name + '[]', 'items name not equal');
        assert.equal(items[0].value, value + 1, 'items value not equal');
        assert.equal(query.item(name), undefined, 'item 1 not equal');
        assert.equal(query.item(name + '[]')[0], value + 1, 'item 1 not equal');
        assert.equal(query.item(name + '[]')[1], value + 2, 'item 2 not equal');
        assert.equal(query.item(name + '[]')[2], value + 3, 'item 3 not equal');
    });

    it('object', () => {
        const name = "myparam";
        const value = "myvalue";
        const queryString = `${name}.${name}=${encodeURIComponent(value)}`;

        const query = QueryStringCollection.createFromQueryString(queryString);

        const str = query.toString();
        const obj = query.toObject();
        const items = query.items;

        assert.equal(str, '?' + queryString, 'querystring not equal');

        assert.equal(obj[name][name], value, 'obj not equal');
        assert.equal(items[0].name, `${name}.${name}`, 'items name not equal');
        assert.equal(items[0].value, value, 'items value not equal');
        assert.equal(query.item(`${name}.${name}`), value, 'item not equal');
    });
});

describe('QueryStringCollection.createFromObject', () => {
    it('simple', () => {
        const name = "myparam";
        const value = "myvalue";
        const queryString = `${name}=${encodeURIComponent(value)}`;

        const query = QueryStringCollection.createFromObject({ myparam: value });

        const str = query.toString();
        const obj = query.toObject()
        const items = query.items;

        assert.equal(str, '?' + queryString, 'querystring not equal');

        assert.equal(obj[name], value, 'obj not equal');
        assert.equal(items[0].name, name, 'items name not equal');
        assert.equal(items[0].value, value, 'items value not equal');
        assert.equal(query.item(name), value, 'item not equal');
    });


    it('array', () => {
        const name = "myparam";
        const value = "myvalue";
        const queryString = `${name}[0]=${encodeURIComponent(value + 1)}&${name}[1]=${encodeURIComponent(value + 2)}&${name}[2]=${encodeURIComponent(value + 3)}`;

        const query = QueryStringCollection.createFromObject({ myparam: [value + 1, value + 2, value + 3] });

        const str = query.toString();
        const obj = query.toObject();
        const items = query.items;

        assert.equal(str, '?' + queryString, 'querystring not equal');

        assert.equal(obj[name][0], value + 1, 'obj 1 not equal');
        assert.equal(obj[name][1], value + 2, 'obj 2 not equal');
        assert.equal(obj[name][2], value + 3, 'obj 3 not equal');
        assert.equal(items[0].name, name + '[0]', 'items name not equal');
        assert.equal(items[0].value, value + 1, 'items value not equal');
        assert.equal(query.item(name), undefined, 'item 1 not equal');
        assert.equal(query.item(name + '[0]'), value + 1, 'item 1 not equal');
        assert.equal(query.item(name + '[1]'), value + 2, 'item 2 not equal');
        assert.equal(query.item(name + '[2]'), value + 3, 'item 3 not equal');
    });

    it('object', () => {
        const name = "myparam";
        const value = "myvalue";
        const queryString = `${name}.${name}=${encodeURIComponent(value)}`;

        const query = QueryStringCollection.createFromObject({ myparam: { myparam: value } });

        const str = query.toString();
        const obj = query.toObject();
        const items = query.items;

        assert.equal(str, '?' + queryString, `querystring not equal`);

        assert.equal(obj[name][name], value, 'obj not equal');
        assert.equal(items[0].name, `${name}.${name}`, 'items name not equal');
        assert.equal(items[0].value, value, 'items value not equal');
        assert.equal(query.item(`${name}.${name}`), value, 'item not equal');
    });

    it('object 2 properties', () => {
        const name = "myparam";
        const prop2name = "myparam2";
        const value = "myvalue";
        const prop2value = "myvalue2";
        const queryString = `${name}.${name}=${encodeURIComponent(value)}&${name}.${prop2name}=${encodeURIComponent(prop2value)}`;

        const query = QueryStringCollection.createFromObject({ [name]: { [name]: value, [prop2name]: prop2value } });

        const str = query.toString();
        const obj = query.toObject();
        const items = query.items;

        assert.equal(str, '?' + queryString, 'querystring not equal');

        assert.equal(obj[name][name], value, `obj not equal '${ JSON.stringify(obj) }'`);
        assert.equal(items[0].name, `${name}.${name}`, 'items name not equal');
        assert.equal(items[0].value, value, 'items value not equal');
        assert.equal(query.item(`${name}.${name}`), value, 'item not equal');

        assert.equal(obj[name][prop2name], prop2value, `obj ${prop2name} not equal`);
        assert.equal(items[1].name, `${name}.${prop2name}`, 'items 1 name not equal');
        assert.equal(items[1].value, prop2value, 'items 1 value not equal');
        assert.equal(query.item(`${name}.${prop2name}`), prop2value, `item ${prop2name}  not equal`);
    });
});