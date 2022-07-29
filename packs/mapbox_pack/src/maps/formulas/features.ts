import * as coda from '@codahq/packs-sdk';
import {liveTest} from '../../../pack';
import {MapBoxClient} from '../../shared/client';
import {GeoJsonFeatureSchema} from '../../shared/schema';
import {populateParams} from '../../shared/utility_functions';
import {
  DatasetIdParam,
  FeatureIdParam,
  GeoJSONFeatureParam,
} from '../parameters';
import {listDatasets} from './data';

export const featuresDynamicSyncTable = coda.makeDynamicSyncTable({
  name: 'Features',
  identityName: 'Feature',
  description:
    'Create a table listing all GeoJSON features from a custom dataset',
  listDynamicUrls: async function (context) {
    let results = [];
    let datasets = await listDatasets(context);

    for (let set of datasets) {
      results.push({display: set.name, value: set.id});
    }
    return results;
  },
  getName: async function (context) {
    let setId = context.sync.dynamicUrl!;

    let client = new MapBoxClient({
      context,
      endpoint: 'datasets/v1/',
      appendUsername: true,
      pathParams: `/${setId}`,
    });

    let result = await client.get();
    return result.name;
  },
  getDisplayUrl: async function (context) {
    return 'https://studio.mapbox.com/datasets/' + context.sync.dynamicUrl;
  },
  //TODO dynamic schema to include custom properties
  getSchema: async function (context, _, {}) {
    return GeoJsonFeatureSchema;
  },
  formula: {
    name: 'ListDatasetFeatures',
    description: '',
    parameters: [],
    execute: async (params, context) => {
      //TODO this is hacky, waiting for bug fix pushed to release version of coda-packs
      let setId = liveTest
        ? 'cl3gejjil19xa21oxpjfscr96'
        : context.sync.dynamicUrl;

      const client = new MapBoxClient({
        context,
        endpoint: 'datasets/v1/',
        appendUsername: true,
        pathParams: `/${setId}/features`,
      });

      let response = await client.get();
      return {result: response.features};
    },
  },
});

const addFeatureParams = [DatasetIdParam, FeatureIdParam, GeoJSONFeatureParam];
export const addFeature = coda.makeFormula({
  resultType: coda.ValueType.String,
  isAction: true,
  name: 'AddFeature',
  description: 'Insert or update a feature in a specified dataset. ',
  parameters: addFeatureParams.map((p) => p.codaDef) as coda.ParamDefs,
  execute: async (params, context) => {
    populateParams(params, addFeatureParams);

    let feature = JSON.parse(GeoJSONFeatureParam.getValue());
    feature.id = FeatureIdParam.getValue();
    const client = new MapBoxClient({
      context,
      endpoint: 'datasets/v1/',
      appendUsername: true,
      pathParams: `/${DatasetIdParam.getValue()}/features/${FeatureIdParam.getValue()}`,
      headers: {'Content-Type': 'application/json'},
      body: feature,
    });
    await client.put();
    return 'OK';
  },
});

const removeFeatureParams = [DatasetIdParam, FeatureIdParam];
export const deleteFeature = coda.makeFormula({
  resultType: coda.ValueType.String,
  name: 'DeleteFeature',
  isAction: true,
  description: 'Delete a feature in a specified dataset.',
  parameters: removeFeatureParams.map((p) => p.codaDef) as coda.ParamDefs,
  execute: async (params, context) => {
    populateParams(params, removeFeatureParams);
    const client = new MapBoxClient({
      context,
      endpoint: 'datasets/v1/',
      appendUsername: true,
      pathParams: `/${DatasetIdParam.getValue()}/features/${FeatureIdParam.getValue()}`,
    });
    await client.delete();
    return 'OK';
  },
});
