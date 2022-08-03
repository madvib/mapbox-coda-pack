import * as coda from '@codahq/packs-sdk';
import {MapBoxClient} from '../../shared/client';
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

export async function listDatasets(context: coda.ExecutionContext) {
  const client = new MapBoxClient({
    context,
    endpoint: 'datasets/v1/',
    appendUsername: true,
  });

  let response = await client.get();

  return response;
}
