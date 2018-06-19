import 'mocha';

(mocha as any).setup('bdd')

import './HeaderCollections.unit.spec';
import './QueryStringCollection.unit.spec';
import './Xhr.spec';

mocha.run();
