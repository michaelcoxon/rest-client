# rest-client
A simple REST client

 - See the api docs at: https://michaelcoxon.github.io/rest-client/
 - Check out the tests to see how to use it better.

# Installation
The library is available on NPM...

```sh
npm -i @michaelcoxon/rest-client
```

# 101

The only implementation at the moment is for in-browser XMLHttpRequest.

use it like this...

```js
import { XhrHttpClient } from '@michaelcoxon/rest-client'

const client = new XhrHttpClient();
const url = 'https://example.com/api/get-data';
const result = await client.getObjectAsync(url);
```