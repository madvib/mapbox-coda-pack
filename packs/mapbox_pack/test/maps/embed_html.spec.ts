import {ParamDefs, ParamValues} from '@codahq/packs-sdk';
import {executeFormulaFromPackDef} from '@codahq/packs-sdk/dist/development';
import {assert} from 'chai';
import {liveTest, pack} from '../../pack';

if (liveTest) {
  describe('Map Formula', () => {
    const params = {
      style: undefined,
      search: undefined,
      zoom: undefined,
      lat: 40.7306,
      long: -73.76291,
      bearing: 0,
      pitch: 0,
      token: undefined,
      zoomWheel: true,
      title: undefined,
      draft: false,
      fallback: false,
    };
    it('returns a valid url', async () => {
      const result = await executeFormulaFromPackDef(
        pack,
        'Map',
        Object.values(params) as ParamValues<ParamDefs>,
        undefined,
        undefined,
        {useRealFetcher: true, manifestPath: require.resolve('../../pack')}
      );
      console.log(result);
      assert.typeOf(result, 'string');
    });
  });
}
