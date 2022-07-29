import * as coda from '@codahq/packs-sdk';
import {MapBoxClient} from '../../shared/client';
import {LatParam, LonParam, Param} from '../../shared/params/param';
import {populateParams} from '../../shared/utility_functions';
import {
  ContoursColorsParam,
  ContoursParam,
  ContourTypeParam,
  DenoiseParam,
  GeneralizeParam,
  PolygonsParam,
  ProfileParam,
} from '../parameters';

const isoProfileParam = ProfileParam(false);

const isochroneParams: Param<any>[] = [
  isoProfileParam,
  LonParam,
  LatParam,
  ContourTypeParam,
  ContoursParam,
  ContoursColorsParam,
  PolygonsParam,
  DenoiseParam,
  GeneralizeParam,
];

export default coda.makeFormula({
  resultType: coda.ValueType.String,
  name: 'Isochrone',
  examples: [
    {
      params: [
        'cycling',
        'longitude:-71.9866',
        'lattitude: 40.7306',
        'contour_type: "minutes"',
        'contours: [30]',
        'polygons: false',
        'denoise: 1',
        'generalize:500',
      ],
      result: '{"features":[{geometry: {...}}...]}',
    },
  ],
  description:
    'The Isochrone API allows you to request polygon or line features that show areas that are reachable within a specified amount of time from a location. Returns a GeoJSON string',
  parameters: isochroneParams.map((p) => p.codaDef) as coda.ParamDefs,

  execute: async function (params, context) {
    populateParams(params, isochroneParams);

    const client = new MapBoxClient({
      context,
      endpoint: 'isochrone/v1/mapbox/',
      pathParams: `${isoProfileParam.getValue()}/${LonParam.getValue()}%2C${LatParam.getValue()}`,
      queryParams: isochroneParams.filter((p) => p.key),
    });
    let result = await client.get();
    return JSON.stringify(result);
  },
});
