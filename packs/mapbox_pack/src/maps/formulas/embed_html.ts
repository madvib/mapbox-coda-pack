import * as coda from '@codahq/packs-sdk';
import checkValidAndPublic from '../../account/check_valid';
import getDefaultToken from '../../account/defaultToken';
import {baseUrl, MapBoxClient} from '../../shared/client';
import {LatParam, LonParam, Param} from '../../shared/params/param';
import {coordinatePairMatcher} from '../../shared/utility_functions';
import {
  BearingParam,
  DraftParam,
  FallbackParam,
  PitchParam,
  SearchParam,
  StyleParam,
  TitleParam,
  TokenParam,
  ZoomParam,
  ZoomWheelParam,
} from '../parameters';

const htmlEmbedParams: Param<any, any>[] = [
  StyleParam,
  SearchParam,
  ZoomParam,
  LatParam,
  LonParam,
  BearingParam,
  PitchParam,
  TokenParam,
  ZoomWheelParam,
  TitleParam,
  DraftParam,
  FallbackParam,
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

    let useSearch = coordinatePairMatcher.test(SearchParam.getValue());
    console.log(useSearch);
    console.log(SearchParam.getValue());

    if (useSearch) {
      let coords = SearchParam.getValue().split(',');
      LonParam.setValue(parseFloat(coords[0]));
      LatParam.setValue(parseFloat(coords[1]));
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

    return (
      coda.withQueryParams(
        baseUrl +
          'styles/v1/' +
          `${StyleParam.getValue()}.html?${
            DraftParam.getValue() ? 'draft/' : ''
          }`,
        {...queryParams, access_token: token}
      ) +
      `#${ZoomParam.getValue()}/${LatParam.getValue()}/${LonParam.getValue()}/${BearingParam.getValue()}/${PitchParam.getValue()}`
    );
  },
});
