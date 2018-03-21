import { expect, assert } from 'chai';
import 'mocha';

import { XhrHttpClient } from '../src/xhr/XhrHttpClient';

describe('XhrHttpClient', () =>
{
    it('constructs', () =>
    {
        const httpClient = new XhrHttpClient();
    });
});