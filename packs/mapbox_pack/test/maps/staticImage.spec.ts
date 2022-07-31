import {PackFormulaValue, ParamDefs, ParamValues} from '@codahq/packs-sdk';
import {executeFormulaFromPackDef} from '@codahq/packs-sdk/dist/development';
import {assert} from 'chai';
import {liveTest, pack} from '../../pack';

if (liveTest) {
  describe('Static Image Formula', () => {
    const params: {[key: string]: PackFormulaValue} = {
      position: 'center',
      token: undefined,
      style: undefined,
      width: 300,
      height: 200,
      twox: false,
      attribution: undefined,
      logo: true,
      long: -122.3486,
      lat: 37.8169,
      zoom: 9,
      bearing: 0,
      pitch: 0,
      bbox: undefined,
      geoJSON: [
        `{"type":"FeatureCollection","features":[{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-122.4285,37.763658]}}]}`,
      ],
      pins: [],
      polylines: [],
      beforelayer: undefined,
      padding: undefined,
    };
    it('returns a valid url', async () => {
      const result = await executeFormulaFromPackDef(
        pack,
        'StaticImage',
        Object.values(params) as ParamValues<ParamDefs>,
        undefined,
        undefined,
        {useRealFetcher: true, manifestPath: require.resolve('../../pack')}
      );
      console.log(result);
      assert.typeOf(result, 'string');
      assert.equal(
        decodeURIComponent(result),
        'https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/geojson({"type":"FeatureCollection","features":[{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-122.4285,37.763658]}}]})/-122.3486,37.8169,9,0,0/300x200?attribution=true&logo=true&access_token=pk.eyJ1IjoibWFkdmliIiwiYSI6ImNsM2VzbXo1ZDAxYTAzanFpZHFzYzA5dW4ifQ.A718S5eVDHTXlJ06Y8v7kg'
      );
    });
  });
}
