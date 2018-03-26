import 'mocha';

(mocha as any).setup('bdd')

import './QueryStringCollection.spec';
import './Xhr.spec';

mocha.run();
