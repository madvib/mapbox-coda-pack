import * as coda from '@codahq/packs-sdk';
import {MapBoxClient} from '../../shared/client';
import {LatParam, LonParam, Param} from '../../shared/params/param';
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

const isochroneParams: Param<any, any>[] = [
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
  //TODO examples
  description:
    'The Isochrone API allows you to request polygon or line features that show areas that are reachable within a specified amount of time from a location.',
  parameters: isochroneParams.map((p) => p.codaDef) as coda.ParamDefs,

  execute: async function (params, context) {
    console.log(params);
    for (let p of params) {
      isochroneParams[params.indexOf(p)].setValue(p);
    }
    const client = new MapBoxClient({
      context,
      endpoint: 'isochrone/v1/mapbox/',
      pathParams: `${isoProfileParam.getValue()}/${LonParam.getValue()},${LatParam.getValue()}`,
      queryParams: isochroneParams.filter((p) => p.key),
    });
    let result = await client.get();
    console.log(result);
    return JSON.stringify(result);
  },
});
