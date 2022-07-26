import * as coda from '@codahq/packs-sdk';
import {autocompleteGeocode} from '../../search/formulas/geocode';
import {MapBoxClient} from '../../shared/client';
import {Param} from '../../shared/params/param';
import {validate} from '../../shared/utility_functions';
import {
  AlternativeRoutesParam,
  ExcludeParam,
  GeometriesParam,
  OverviewParam,
  ProfileParam,
} from '../parameters';
import {DirectionsResponseSchema} from '../schema';

const drivingProfileParam = ProfileParam(true);
const excludeParam = ExcludeParam(drivingProfileParam);

const directionsParams: Param<any, any>[] = [
  drivingProfileParam,
  AlternativeRoutesParam,
  excludeParam,
  GeometriesParam,
  OverviewParam,
];

export default coda.makeFormula({
  resultType: coda.ValueType.Object,
  schema: DirectionsResponseSchema,
  name: 'Directions',
  //TODO examples
  description:
    'Retrieve directions between waypoints. Directions requests must specify at least two waypoints as starting and ending points.',
  parameters: directionsParams.map((p) => p.codaDef) as coda.ParamDefs,
  varargParameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: 'coordinates',
      description:
        'Longitude, Latitude coordinate pair. Latitude must be a number between -85.0511 and 85.0511 and Longitude must be between -180 and 180.',
      optional: true,
      autocomplete: autocompleteGeocode,
    }),
  ],
  execute: async function (params, context) {
    let args = params.slice(0, directionsParams.length - 1);
    for (let p of args) {
      directionsParams[params.indexOf(p)].setValue(p);
    }

    let coordinates: string[] = params.slice(
      directionsParams.length
    ) as string[];

    coordinates.filter(
      (val) =>
        parseFloat(val.split(',')[0]) >= -180 &&
        parseFloat(val.split(',')[0]) <= 180 &&
        parseFloat(val.split(',')[1]) >= -85.0511 &&
        parseFloat(val.split(',')[1]) <= 85.0511
    );
    validate(
      coordinates.length <= 1 || coordinates.length > 25,
      'Must supply between 2 and 25 coordinates to get directions'
    );

    const client = new MapBoxClient({
      context,
      endpoint: 'directions/v5/mapbox/',
      pathParams: `${drivingProfileParam.getValue()}/${coordinates.join(';')}`,
      queryParams: directionsParams.filter((p) => p.key),
    });
    let result = await client.get();
    console.log(result);
    return JSON.stringify(result);
  },
});
