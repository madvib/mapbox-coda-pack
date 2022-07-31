import * as coda from '@codahq/packs-sdk';
import {MapBoxClient} from '../shared/client';

export default async function checkValidAndPublic(
  context: coda.ExecutionContext,
  token: string
): Promise<boolean> {
  let client = new MapBoxClient({
    context,
    endpoint: 'tokens/v2/',
    token: token,
  });

  let response = await client.get();

  return response.code === 'TokenValid' && response.token.usage !== 'sk';
}
