import * as coda from '@codahq/packs-sdk';
import {Param} from '../../shared/param';
import {
  // AddLayerParam,
  AttributionParam,
  AutoParam,
  BearingParam,
  HeightParam,
  LatParam,
  LayerIdParam,
  LogoParam,
  LonParam,
  OverlayParam,
  PaddingParam,
  PitchParam,
  SetFilterParam,
  StyleParam,
  TokenParam,
  TwoXParam,
  WidthParam,
  ZoomParam,
} from '../parameters';

const staticImgParams: Param<any, any>[] = [
  StyleParam,
  OverlayParam,
  LonParam,
  LatParam,
  ZoomParam,
  AutoParam,
  WidthParam,
  HeightParam,
  BearingParam,
  PitchParam,
  TwoXParam,
  AttributionParam,
  LogoParam,
  // AddLayerParam,
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
    return '';
  },
});
