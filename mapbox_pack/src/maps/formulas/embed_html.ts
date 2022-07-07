import * as coda from '@codahq/packs-sdk';
import {baseUrl, MapBoxClient} from '../../shared/client';
import {Param} from '../../shared/param';
import {
  DraftParam,
  FallbackParam,
  MapboxGLGeocoderVersionParam,
  MapboxGLVersionParam,
  StyleParam,
  TitleParam,
  TokenParam,
  ZoomWheelParam,
} from '../parameters';

const htmlEmbedParams: Param<any, any>[] = [
  StyleParam,
  TokenParam,
  ZoomWheelParam,
  TitleParam,
  DraftParam,
  FallbackParam,
  MapboxGLVersionParam,
  MapboxGLGeocoderVersionParam,
];

export const htmlEmbed = coda.makeFormula({
  resultType: coda.ValueType.String,
  codaType: coda.ValueHintType.Url,
  name: 'Map',
  description:
    'Embed url that shows a map in your selected style. Recommended to set force: true in Embed formula. You can optionally pass a temporary token using the { GenerateToken } formula to, otherwise it will use the default token associated with your mapbox account.',
  // TODO  examples:
  parameters: htmlEmbedParams.map((p) => p.codaDef) as coda.ParamDefs,
  execute: async function (params, context) {
    for (let p of params) {
      htmlEmbedParams[params.indexOf(p)].setValue(p);
    }

    let token =
      TokenParam.include() &&
      checkValidAndPublic(context, TokenParam.getValue())
        ? TokenParam.getValue()
        : await getDefaultToken(context);

    let queryParams: {
      [key: string]: any;
    } = {};

    for (var p of htmlEmbedParams) {
      if (p.key && p.include()) queryParams[p.key] = p.getValue();
    }

    return coda.withQueryParams(
      baseUrl +
        'styles/v1/' +
        `${StyleParam.getValue()}.html?${
          DraftParam.getValue() ? 'draft/' : ''
        }`,
      {...queryParams, access_token: token}
    );
  },
});

// pass as parameter rule?
async function checkValidAndPublic(
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
async function getDefaultToken(
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
