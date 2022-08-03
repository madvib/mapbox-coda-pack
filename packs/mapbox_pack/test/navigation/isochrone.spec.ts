import {ParamDefs, ParamValues} from '@codahq/packs-sdk';
import {executeFormulaFromPackDef} from '@codahq/packs-sdk/dist/development';
import {assert} from 'chai';
import {liveTest, pack} from '../../pack';

if (liveTest) {
  describe('Iscochrone Formula', () => {
    const isochroneParams = {
      profile: 'driving',
      lon: -122.310567,
      lat: 41.309875,
      contourType: 'minutes',
      contours: [30],
      contoursColors: undefined,
      polygons: true,
      denoise: 1,
      generalize: 500,
    };
    it('returns stringified geoJSON', async () => {
      const result = await executeFormulaFromPackDef(
        pack,
        'Isochrone',
        Object.values(isochroneParams) as ParamValues<ParamDefs>,
        undefined,
        undefined,
        {useRealFetcher: true, manifestPath: require.resolve('../../pack')}
      );
      assert.typeOf(result, 'string');
    });
  });
}
