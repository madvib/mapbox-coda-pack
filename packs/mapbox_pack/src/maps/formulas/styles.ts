import * as coda from '@codahq/packs-sdk';
import {MapBoxClient} from '../../shared/client';
import {MapBoxStyles} from '../../shared/params/constants';
import {ListStylesSchema} from '../schema';

export const stylesSyncTable = coda.makeSyncTable({
  schema: ListStylesSchema,
  name: 'CustomStyles',
  identityName: 'Style',
  description: '',
  formula: {
    name: 'FetchCustomStyles',
    description: '',
    parameters: [],
    execute: async (_, context) => {
      let response = await await getStyles(context);

      return {result: response};
    },
  },
});

export async function getStyles(context: coda.ExecutionContext) {
  const client = new MapBoxClient({
    context,
    endpoint: 'styles/v1/',
    appendUsername: true,
  });

  let response = await client.get();

  return response;
}

export async function autocompleteStyles(
  context: coda.ExecutionContext,
  search: string
) {
  let styles: Array<any> = await getStyles(context);
  styles.map((s) => {
    return {name: s.name, value: `${s.owner}/${s.id}`};
  });
  let results = [...styles, ...MapBoxStyles];
  return coda.autocompleteSearchObjects(search, results, 'name', 'value');
}

export async function autocompleteLayersForStyle(
  context: coda.ExecutionContext,
  style: string,
  search: string
) {
  const client = new MapBoxClient({
    context,
    endpoint: 'styles/v1/',
    pathParams: style,
  });
  let res = await client.get();
  let layers = res.layers;

  return coda.autocompleteSearchObjects(search, layers, 'id', 'id');
}
