import * as coda from '@codahq/packs-sdk';
import {MapBoxClient} from '../shared/client';

export default async function getDefaultToken(
  context: coda.ExecutionContext
): Promise<string> {
  let client = new MapBoxClient({
    context,
    endpoint: 'tokens/v2/',
    appendUsername: true,
    pathParams: '?default=true',
  });

  let response = await client.get();
  let token = response[0].token;
  return token;
}
