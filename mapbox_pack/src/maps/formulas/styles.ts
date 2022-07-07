import * as coda from '@codahq/packs-sdk';
import {MapBoxClient} from '../../shared/client';

export const ListStylesSchema = coda.makeObjectSchema({
  properties: {
    version: {type: coda.ValueType.Number},
    name: {type: coda.ValueType.String},
    created: {type: coda.ValueType.String},
    id: {type: coda.ValueType.String},
    modified: {type: coda.ValueType.String},
    owner: {type: coda.ValueType.String},
    //TODO add more props
  },
  displayProperty: 'name', // Which property above to display by default.
  idProperty: 'id',
});
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

export const MapBoxStyles = [
  {name: 'MapBox Streets', value: 'mapbox/streets-v11'},
  {name: 'MapBox Outdoors', value: 'mapbox/outdoors-v11'},
  {name: 'MapBox Light', value: 'mapbox/light-v10'},
  {name: 'MapBox Dark', value: 'mapbox/dark-v10'},
  {name: 'MapBox Satellite', value: 'mapbox/satellite-v9'},
  {name: 'MapBox Satellite Streets', value: 'mapbox/satellite-streets,-v11'},
  {name: 'MapBox Navigation Day', value: 'mapbox/navigation-day-v1'},
  {name: 'MapBox Navigation Night', value: 'mapbox/navigation-night-v1'},
];

export async function autocompleteStyles(
  context: coda.ExecutionContext,
  search: string
) {
  let styles: Array<any> = await getStyles(context);
  styles.map((s) => {
    return {name: s.name, value: `${s.owner}/${s.id}`};
  });
  let results = [...styles, ...MapBoxStyles];
  return coda.autocompleteSearchObjects(search, results, 'name', 'id');
}
