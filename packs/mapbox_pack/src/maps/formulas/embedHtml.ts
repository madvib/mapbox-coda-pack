import * as coda from '@codahq/packs-sdk';
import checkValidAndPublic from '../../account/checkValid';
import getDefaultToken from '../../account/defaultToken';
import {baseUrl} from '../../shared/client';
import {LatParam, LonParam, Param} from '../../shared/params/param';
import {
  coordinatePairMatcher,
  populateParams,
} from '../../shared/utility_functions';
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

const htmlEmbedParams: Param<any>[] = [
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
  description: `Embed a map in your selected style with the URL this formula returns. Pass coordinates or use the search param to lookup a place without leaving the formula editor.
  Recommended to manually use Embed formula with force: true.`,
  examples: [
    {
      params: [],
      result:
        '"https://api.mapbox.com/styles/v1/mapbox/streets-v11.html?access_token=YOUR_PUBLIC_TOKEN#15/37.771/-122.436/0/0"',
    },
    {
      params: [
        `style: "madvib/cl3gbvxgx000815to9dt19tt3"`,
        'long: -76.9',
        'lat: 38.9',
        'zoom: 12',
        'bearing: 40',
        'pitch: 20',
      ],
      result:
        '"https://api.mapbox.com/styles/v1/mapbox/streets-v11.html?access_token=YOUR_PUBLIC_TOKEN#12/38.9/-76.9/40/20"',
    },
  ],
  parameters: htmlEmbedParams.map((p) => p.codaDef) as coda.ParamDefs,
  execute: async function (params, context) {
    populateParams(params, htmlEmbedParams);

    let useSearch = coordinatePairMatcher.test(SearchParam.getValue());

    if (useSearch) {
      let coords = SearchParam.getValue().split(',');
      LonParam.setValue(parseFloat(coords[0]));
      LatParam.setValue(parseFloat(coords[1]));
    }

    let token =
      TokenParam.meetsConditions() &&
      checkValidAndPublic(context, TokenParam.getValue())
        ? TokenParam.getValue()
        : await getDefaultToken(context);

    let queryParams: {
      [key: string]: any;
    } = {};

    for (var p of htmlEmbedParams) {
      if (p.key && p.meetsConditions()) queryParams[p.key] = p.getValue();
    }

    let url =
      coda.withQueryParams(
        baseUrl +
          'styles/v1/' +
          `${StyleParam.getValue()}.html?${
            DraftParam.getValue() ? 'draft/' : ''
          }`,
        {...queryParams, access_token: token}
      ) +
      `#${ZoomParam.getValue()}/${LatParam.getValue()}/${LonParam.getValue()}/${BearingParam.getValue()}/${PitchParam.getValue()}`;
    console.log(url);
    return url;
  },
});
