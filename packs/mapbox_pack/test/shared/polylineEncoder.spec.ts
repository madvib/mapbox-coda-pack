import {executeFormulaFromPackDef} from '@codahq/packs-sdk/dist/development';
import {assert} from 'chai';
import {pack} from '../../pack';

describe('Polyline Encoder', () => {
  it('encodes polyline correctly', async () => {
    const result = await executeFormulaFromPackDef(pack, 'EncodePolyline', [
      [38.5, -120.2],
      [40.7, -120.95],
      [43.252, -126.453],
    ]);
    console.log(result);
    assert.typeOf(result, 'string');
    assert.equal(result, '_p~iF~ps|U_ulLnnqC_mqNvxq`@');
  });
});
