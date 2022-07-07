import * as coda from '@codahq/packs-sdk';
import {getUsername, MapBoxClient} from '../../shared/client';
import {GeoJsonFeatureSchema} from '../../shared/schema';
import {DatasetSchema} from '../schema';

export const datasetSyncTable = coda.makeSyncTable({
  schema: DatasetSchema,
  name: 'Datasets',
  identityName: 'Dataset',
  description:
    'List all datasets associated with your account, these can be referenced in other formulas to add/remove features or export to a Tileset',
  formula: {
    name: 'ListDatasets',
    description: '',
    parameters: [],
    execute: async function ([], context: coda.ExecutionContext) {
      let response = await listDatasets(context);
      return {result: response};
    },
  },
});

export const featuresDynamicSyncTable = coda.makeDynamicSyncTable({
  name: 'Features',
  identityName: 'Feature',
  description:
    'Create a table listing all GeoJSON features from a custom dataset',
  listDynamicUrls: async function (context) {
    let results = [];
    let datasets = await listDatasets(context);

    console.log(datasets);
    for (let set of datasets) {
      let url = `datasets/v1/${getUsername(context)}/${set.id}`;
      results.push({display: set.name, value: set.id});
    }
    console.log(results);
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
    console.log(result);
    return result.name;
  },
  getDisplayUrl: async function (context) {
    return 'https://studio.mapbox.com/datasets/' + context.sync.dynamicUrl;
  },
  //TODO dynamic schema to include custom properties
  getSchema: async function (context, _, {}) {
    console.log(_);
    return GeoJsonFeatureSchema;
  },
  formula: {
    name: 'ListDatasetFeatures',
    description: '',
    parameters: [],
    execute: async (params, context) => {
      let setId = context.sync.dynamicUrl;
      const client = new MapBoxClient({
        context,
        endpoint: 'datasets/v1/',
        appendUsername: true,
        pathParams: `/${setId}/features`,
      });

      let response = await client.get();
      console.log(response);
      return {result: response.features};
    },
  },
});

async function listDatasets(context: coda.ExecutionContext) {
  const client = new MapBoxClient({
    context,
    endpoint: 'datasets/v1/',
    appendUsername: true,
  });

  let response = await client.get();

  return response;
}
