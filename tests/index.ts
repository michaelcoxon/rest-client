import 'mocha';

(mocha as any).setup('bdd')

import './RestService.spec';
import './Xhr.spec';
import './HeaderCollections.unit.spec';

mocha.run();
