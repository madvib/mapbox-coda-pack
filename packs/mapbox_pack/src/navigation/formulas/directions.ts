import * as coda from '@codahq/packs-sdk';
import {MapBoxClient} from '../../shared/client';
import {Param} from '../../shared/params/param';
import {populateParams} from '../../shared/utility_functions';
import {
  AlternativeRoutesParam,
  CoordinatesParam,
  ExcludeParam,
  GeometriesParam,
  OverviewParam,
  ProfileParam,
} from '../parameters';
import {DirectionsResponseSchema} from '../schema';

const directionsProfileParam = ProfileParam(true);
const excludeParam = ExcludeParam(directionsProfileParam);

const directionsParams: Param<any>[] = [
  directionsProfileParam,
  CoordinatesParam,
  AlternativeRoutesParam,
  excludeParam,
  GeometriesParam,
  OverviewParam,
];

export default coda.makeFormula({
  resultType: coda.ValueType.Object,
  schema: DirectionsResponseSchema,
  name: 'Directions',
  description:
    'Retrieve directions between waypoints. Directions requests must specify at least two waypoints as starting and ending points.',
  examples: [
    {
      params: [
        'cycling',
        `List('-71.9866, 40.7306','-73.754968, 42.651167','-73.76291,41.033986')`,
      ],
      result: '{Main Street, Mermaid Lane, Hanover Street}',
    },
  ],
  parameters: directionsParams.map((p) => p.codaDef) as coda.ParamDefs,

  execute: async function (params, context) {
    populateParams(params, directionsParams);

    const client = new MapBoxClient({
      context,
      endpoint: 'directions/v5/mapbox/',
      pathParams: `${directionsProfileParam.getValue()}/${CoordinatesParam.getValue()}`,
      queryParams: directionsParams.filter((p) => p.key),
    });
    let result = await client.get();
    return result;
  },
});
