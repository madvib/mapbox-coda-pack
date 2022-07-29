import * as coda from '@codahq/packs-sdk';
import checkValidAndPublic from '../../account/check_valid';
import getDefaultToken from '../../account/defaultToken';
import {baseUrl} from '../../shared/client';
import {LatParam, LonParam, Param} from '../../shared/params/param';
import {populateParams} from '../../shared/utility_functions';
import {
  // AddLayerParam,
  AttributionParam,
  PositionParam,
  BearingParam,
  BeforeLayerParam,
  HeightParam,
  LayerIdParam,
  LogoParam,
  MapBboxParam,
  OverlayParam,
  PaddingParam,
  PitchParam,
  // SetFilterParam,
  StyleParam,
  TwoXParam,
  WidthParam,
  ZoomParam,
  TokenParam,
} from '../parameters';

const staticImgParams: Param<any>[] = [
  PositionParam,
  TokenParam,
  StyleParam,
  WidthParam,
  HeightParam,
  TwoXParam,
  AttributionParam,
  LogoParam,
  LonParam,
  LatParam,
  ZoomParam,
  BearingParam,
  PitchParam,
  MapBboxParam,
  OverlayParam,
  BeforeLayerParam,
  // SetFilterParam,
  LayerIdParam,
  PaddingParam,
];

export const staticImage = coda.makeFormula({
  resultType: coda.ValueType.String,
  codaType: coda.ValueHintType.ImageAttachment,
  name: 'StaticImage',
  description:
    'Retrieve a static image that looks like an embedded map but does not have interactivity or controls',
  examples: [
    {
      params: [],
      result:
        '"https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/geojson({"type":"FeatureCollection","features":[{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[-122.4285,37.763658]}}]})/-122.3486,37.8169,9,0/300x200?access_token=YOUR_PUBLIC_TOKEN"',
    },
  ],
  parameters: staticImgParams.map((p) => p.codaDef) as coda.ParamDefs,
  execute: async function (params, context) {
    populateParams(params, staticImgParams);

    let token =
      TokenParam.meetsConditions() &&
      checkValidAndPublic(context, TokenParam.getValue())
        ? TokenParam.getValue()
        : await getDefaultToken(context);

    function getOverlays() {
      let overlays: string = '';
      if (OverlayParam.meetsConditions()) {
        let formattedGeoJson = OverlayParam.getValue().map((p) => {
          return `geojson(${encodeURIComponent(p.replace(/[\s\n\r]+/g, ''))})`;
        });

        overlays = formattedGeoJson.join();
      }
      if (overlays !== '') {
        overlays += '/';
      }
      return overlays;
    }

    function getPosition() {
      let position: string;
      switch (PositionParam.getValue()) {
        case 'auto':
          position = 'auto';
          PaddingParam.setValue(undefined);
          break;
        case 'bounding box':
          position = MapBboxParam.meetsConditions()
            ? `[${MapBboxParam.getValue()}]`
            : '';
          PaddingParam.setValue(undefined);
          break;
        default:
          position = `${LonParam.getValue()},${LatParam.getValue()},${ZoomParam.getValue()},${BearingParam.getValue()},${PitchParam.getValue()}`;
          break;
      }

      return position;
    }
    let queryParams: {
      [key: string]: any;
    } = {};

    for (var p of staticImgParams) {
      if (p.key && p.meetsConditions()) queryParams[p.key] = p.getValue();
    }
    let url = coda.withQueryParams(
      baseUrl +
        'styles/v1/' +
        `${StyleParam.getValue()}/static/${getOverlays()}${getPosition()}/${WidthParam.getValue()}x${HeightParam.getValue()}${TwoXParam.getValue()}`,
      {...queryParams, access_token: token}
    );
    return url;
  },
});
