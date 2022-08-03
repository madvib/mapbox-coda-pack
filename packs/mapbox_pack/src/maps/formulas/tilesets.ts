import * as coda from '@codahq/packs-sdk';
import {MapBoxClient} from '../../shared/client';
import {MapBoxTilesets} from '../../shared/params/constants';
import {TilesetSchema} from '../schema';

export const tilesetSyncTable = coda.makeSyncTable({
  schema: TilesetSchema,
  name: 'Tilesets',
  identityName: 'Tileset',
  description:
    'List all tilesets belonging to your Mapbox account, requires token with tilesets:list scope',
  formula: {
    name: 'FetchTilesets',
    description: '',
    parameters: [],
    execute: async (_, context) => {
      let response = await getTilesets(context);
      return {result: response};
    },
  },
});

export async function autocompleteTilesets(
  context: coda.ExecutionContext,
  search: string
) {
  let tilesets: Array<any> = await getTilesets(context);
  tilesets.map((t) => {
    return {name: t.name, value: t.id};
  });
  let results = [...tilesets, ...MapBoxTilesets];
  return coda.autocompleteSearchObjects(search, results, 'name', 'value');
}

export async function getTilesets(context: coda.ExecutionContext) {
  const client = new MapBoxClient({
    context,
    endpoint: 'tilesets/v1/',
    appendUsername: true,
  });

  let response = await client.get();

  return response;
}
