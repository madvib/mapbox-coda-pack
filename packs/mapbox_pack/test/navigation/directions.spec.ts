import {ParamDefs, ParamValues} from '@codahq/packs-sdk';
import {executeFormulaFromPackDef} from '@codahq/packs-sdk/dist/development';
import {assert} from 'chai';
import {liveTest, pack} from '../../pack';

if (liveTest) {
  describe('Directions Formula', () => {
    const params = {
      profile: 'driving',
      coordinates: [
        '-73.9866, 40.7306',
        '-73.754968, 42.651167',
        '-73.76291,41.033986 ',
      ],
      alternatives: true,
      exclude: ['toll', 'ferrry'],
      geometries: 'polyline',
      overview: undefined,
    };
    it('returns a valid object', async () => {
      const result = await executeFormulaFromPackDef(
        pack,
        'Directions',
        Object.values(params) as ParamValues<ParamDefs>,
        undefined,
        undefined,
        {useRealFetcher: true, manifestPath: require.resolve('../../pack')}
      );
      let waypoints: any[] = result.Waypoints;
      console.log(result);
      console.log(waypoints);
      assert.equal(waypoints.length, 3);
    });
  });
}
