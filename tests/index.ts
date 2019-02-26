import 'mocha';

(mocha as any).setup('bdd')

import './Xhr.spec';
import './HeaderCollections.unit.spec';
import './QueryStringCollection.unit.spec';

mocha.run();
