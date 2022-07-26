import * as coda from '@codahq/packs-sdk';
import {format} from 'path';
import checkValidAndPublic from '../../account/check_valid';
import getDefaultToken from '../../account/defaultToken';
import {baseUrl, MapBoxClient} from '../../shared/client';
import {LatParam, LonParam, Param} from '../../shared/params/param';
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
  SetFilterParam,
  StyleParam,
  TwoXParam,
  WidthParam,
  ZoomParam,
  TokenParam,
} from '../parameters';

const staticImgParams: Param<any, any>[] = [
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
  SetFilterParam,
  LayerIdParam,
  PaddingParam,
];

export const staticImage = coda.makeFormula({
  resultType: coda.ValueType.String,
  codaType: coda.ValueHintType.ImageAttachment,
  name: 'StaticImage',
  description:
    'Retrieve a static image that looks like an embedded map but does not have interactivity or controls',
  // TODO  examples:
  parameters: staticImgParams.map((p) => p.codaDef) as coda.ParamDefs,
  execute: async function (params, context) {
    for (let p of params) {
      staticImgParams[params.indexOf(p)].setValue(p);
    }
    let token =
      TokenParam.include() &&
      checkValidAndPublic(context, TokenParam.getValue())
        ? TokenParam.getValue()
        : await getDefaultToken(context);

    function getOverlays() {
      let overlays: string = '';
      console.log(OverlayParam.include());
      if (OverlayParam.include()) {
        console.log(OverlayParam.getValue());
        let formattedGeoJson = OverlayParam.getValue().map((p) => {
          console.log(p);
          return `geojson(${encodeURIComponent(p)})`;
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
      console.log(PositionParam.getValue());
      switch (PositionParam.getValue()) {
        case 'auto':
          position = 'auto';
          PaddingParam.setValue(undefined);
          break;
        case 'bounding box':
          position = MapBboxParam.include()
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
      if (p.key && p.include()) queryParams[p.key] = p.getValue();
    }
    let url = coda.withQueryParams(
      baseUrl +
        'styles/v1/' +
        `${StyleParam.getValue()}/static/${getOverlays()}${getPosition()}/${WidthParam.getValue()}x${HeightParam.getValue()}${TwoXParam.getValue()}`,
      {...queryParams, access_token: token}
    );
    console.log(url);
    return url;
  },
});
