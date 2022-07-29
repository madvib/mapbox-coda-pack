import {ParamDefs, ParamValues} from '@codahq/packs-sdk';
import {executeFormulaFromPackDef} from '@codahq/packs-sdk/dist/development';
import {assert} from 'chai';
import {liveTest, pack} from '../../pack';

if (liveTest) {
  describe('Tilequery Formula', () => {
    const params = {
      tileset: undefined,
      search: undefined,
      lat: 44.9454,
      long: -93.1213,
      radius: 50,
      limit: 4,
      dedupe: undefined,
      geometryType: undefined,
      layers: undefined,
    };
    it('returns a list of features', async () => {
      const result = await executeFormulaFromPackDef(
        pack,
        'Tilequery',
        Object.values(params) as ParamValues<ParamDefs>,
        undefined,
        undefined,
        {useRealFetcher: true, manifestPath: require.resolve('../../pack')}
      );
      console.log(result);
      let features: any[] = result.Features;
      assert.isTrue(features.length > 0);
    });
  });
}
