import {ParamDefs, ParamValues} from '@codahq/packs-sdk';
import {executeFormulaFromPackDef} from '@codahq/packs-sdk/dist/development';
import {assert} from 'chai';
import {liveTest, pack} from '../../pack';

if (liveTest) {
  describe('Map Formula', () => {
    const params = {
      style: undefined,
      long: -122.436,
      lat: 37.771,
      zoom: undefined,
      bearing: 0,
      pitch: 0,
      search: undefined,
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
      assert.isTrue(
        (result as string).startsWith(
          'https://api.mapbox.com/styles/v1/mapbox/streets-v11.html?'
        )
      );
    });
  });
}
