import * as coda from '@codahq/packs-sdk';
import {MapBoxClient} from '../../shared/client';
import {LatParam, LonParam, Param} from '../../shared/params/param';
import {
  coordinatePairMatcher,
  populateParams,
} from '../../shared/utility_functions';
import {
  DedupeParam,
  GeometryTypeParam,
  LayersParam,
  LimitParam,
  RadiusParam,
  SearchParam,
  TilesetParam,
} from '../parameters';
import {TilequeryResultSchema} from '../schema';

const tilequeryParams: Param<any>[] = [
  TilesetParam,
  SearchParam,
  LatParam,
  LonParam,
  RadiusParam,
  LimitParam,
  DedupeParam,
  GeometryTypeParam,
  LayersParam,
];

export const tilequery = coda.makeFormula({
  resultType: coda.ValueType.Object,
  schema: TilequeryResultSchema,
  name: 'Tilequery',
  description:
    'Return the location and properties of the features within the query radius.',
  examples: [
    {params: ['central park'], result: '{FeatureCollection}'},
    {
      params: [
        'statue of liberty',
        'autocomplete:true',
        'country: ["US"]',
        'limit:5',
        'proximity: ip',
      ],
      result: '{FeatureCollection}',
    },
  ],
  parameters: tilequeryParams.map((p) => p.codaDef) as coda.ParamDefs,
  execute: async function (params, context) {
    populateParams(params, tilequeryParams);

    let useSearch = coordinatePairMatcher.test(SearchParam.getValue());

    if (useSearch) {
      let coords = SearchParam.getValue().split(',');
      LonParam.setValue(parseFloat(coords[0]));
      LatParam.setValue(parseFloat(coords[1]));
    }

    const client = new MapBoxClient({
      context,
      endpoint: 'v4/',
      pathParams: `${TilesetParam.getValue()}/tilequery/${LonParam.getValue()},${LatParam.getValue()}.json`,
      queryParams: tilequeryParams.filter((p) => p.key),
    });

    return client.get();
  },
});
