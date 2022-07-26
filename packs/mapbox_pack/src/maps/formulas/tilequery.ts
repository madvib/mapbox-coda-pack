import * as coda from '@codahq/packs-sdk';
import {MapBoxClient} from '../../shared/client';
import {LatParam, LonParam, Param} from '../../shared/params/param';
import {GeoJsonFeatureCollectionSchema} from '../../shared/schema';
import {coordinatePairMatcher} from '../../shared/utility_functions';
import {
  DedupeParam,
  GeometryTypeParam,
  LayersParam,
  LimitParam,
  RadiusParam,
  SearchParam,
  TilesetParam,
} from '../parameters';

const tilequeryParams: Param<any, any>[] = [
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
  schema: GeoJsonFeatureCollectionSchema,
  name: 'Tilequery',
  description:
    'The Tilequery API returns the location and properties of the features within the query radius.',
  // TODO  examples:
  parameters: tilequeryParams.map((p) => p.codaDef) as coda.ParamDefs,
  execute: async function (params, context) {
    for (let p of params) {
      tilequeryParams[params.indexOf(p)].setValue(p);
    }

    let useSearch = coordinatePairMatcher.test(SearchParam.getValue());
    console.log(useSearch);
    console.log(SearchParam.getValue());

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
