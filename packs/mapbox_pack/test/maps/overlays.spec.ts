import {PackFormulaValue, ParamDefs, ParamValues} from '@codahq/packs-sdk';
import {executeFormulaFromPackDef} from '@codahq/packs-sdk/dist/development';
import {assert} from 'chai';
import {pack} from '../../pack';

describe('Overlay Formulas', () => {
  it('returns a formatted Path overlay', async () => {
    const params: {[key: string]: PackFormulaValue} = {
      polyline: '%7DrpeFxbnjVsFwdAvr@cHgFor@jEmAlFmEMwM_FuItCkOi@wc@bg@wBSgM',
      strokeWidth: 5,
      strokeColor: 'f44',
      strokeOpacity: 0.5,
      fillColor: undefined,
      fillOpacity: undefined,
    };
    const result = await executeFormulaFromPackDef(
      pack,
      'PathOverlay',
      Object.values(params) as ParamValues<ParamDefs>
    );
    assert.typeOf(result, 'string');
    assert.equal(
      result,
      'path-5+f44-0.5(%7DrpeFxbnjVsFwdAvr@cHgFor@jEmAlFmEMwM_FuItCkOi@wc@bg@wBSgM)'
    );
  });
  it('returns a formatted Marker overlay', async () => {
    const params: {[key: string]: PackFormulaValue} = {
      long: -74.0021,
      lat: 40.7338,
      markerSize: true,
      label: 'embassy',
      color: 'f74e4e',
      customMarker: undefined,
    };
    const result = await executeFormulaFromPackDef(
      pack,
      'MarkerOverlay',
      Object.values(params) as ParamValues<ParamDefs>
    );
    console.log(result);
    assert.typeOf(result, 'string');
    assert.equal(result, 'pin-l-embassy+f74e4e(-74.0021,40.7338)');
  });
  it('returns a formatted Custom Marker overlay', async () => {
    const params: {[key: string]: PackFormulaValue} = {
      long: -76.9,
      lat: 38.9,
      markerSize: undefined,
      label: undefined,
      color: undefined,
      customMarker: 'https://docs.mapbox.com/api/img/custom-marker.png',
    };
    const result = await executeFormulaFromPackDef(
      pack,
      'MarkerOverlay',
      Object.values(params) as ParamValues<ParamDefs>
    );
    console.log(result);
    assert.typeOf(result, 'string');
    assert.equal(
      result,
      'url-https%3A%2F%2Fdocs.mapbox.com%2Fapi%2Fimg%2Fcustom-marker.png(-76.9,38.9)'
    );
  });
});
