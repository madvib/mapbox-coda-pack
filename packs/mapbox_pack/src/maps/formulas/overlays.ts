import * as coda from '@codahq/packs-sdk';
import {LatParam, LonParam, Param} from '../../shared/params/param';
import {populateParams} from '../../shared/utility_functions';
import {
  CustomMarkerParam,
  FillColorParam,
  FillOpacityParam,
  MarkerColorParam,
  MarkerLabelParam,
  MarkerSizeParam,
  PolylineParam,
  StrokeColorParam,
  StrokeOpacityParam,
  StrokeWidthParam,
} from '../parameters';

const pathParams: Param<any>[] = [
  PolylineParam,
  StrokeWidthParam,
  StrokeColorParam,
  StrokeOpacityParam,
  FillColorParam,
  FillOpacityParam,
];
export const pathOverlay = coda.makeFormula({
  resultType: coda.ValueType.String,
  name: 'PathOverlay',
  description: 'Format and style a polyline for use as a StaticImage overlay',
  examples: [
    {
      params: [
        'polyline: %7DrpeFxbnjVsFwdAvr@cHgFor@jEmAlFmEMwM_FuItCkOi@wc@bg@wBSgM',
        'strokeWidth: 5',
        'strokeColor: f44',
        'strokeOpacity: 0.5',
      ],
      result:
        'path-5+f44-0.5(%7DrpeFxbnjVsFwdAvr@cHgFor@jEmAlFmEMwM_FuItCkOi@wc@bg@wBSgM)',
    },
  ],
  parameters: pathParams.map((p) => p.codaDef) as coda.ParamDefs,
  execute: async function (params, context) {
    populateParams(params, pathParams);

    let strokeWidth: string = StrokeWidthParam.meetsConditions()
      ? `-${StrokeWidthParam.getValue()}`
      : '';
    let strokeColor: string = StrokeColorParam.meetsConditions()
      ? `+${StrokeColorParam.getValue()}`
      : '';
    let strokeOpacity: string = StrokeOpacityParam.meetsConditions()
      ? `-${StrokeOpacityParam.getValue()}`
      : '';
    let fillColor: string = FillColorParam.meetsConditions()
      ? `+${FillColorParam.getValue()}`
      : '';
    let fillOpacity: string = FillOpacityParam.meetsConditions()
      ? `-${FillOpacityParam.getValue()}`
      : '';

    return `path${
      strokeWidth + strokeColor + strokeOpacity + fillColor + fillOpacity
    }(${PolylineParam.getValue()})`;
  },
});

const markerParams: Param<any>[] = [
  LonParam,
  LatParam,
  MarkerSizeParam,
  MarkerLabelParam,
  MarkerColorParam,
  CustomMarkerParam,
];
export const markerOverlay = coda.makeFormula({
  resultType: coda.ValueType.String,
  name: 'MarkerOverlay',
  description:
    'Format and style a marker (pin) for use as a StaticImage overlay, optionally pass an img URL to place a custom marker.',
  examples: [
    {
      params: [
        'lon: -74.0021',
        'lat: 40.7338',
        'large: true',
        'label: embassy',
        'color: f74e4e',
      ],
      result: 'pin-l-embassy+f74e4e(-74.0021,40.7338)',
    },
    {
      params: [
        'lon: -74.0021',
        'lat: 40.7338',
        'customMarker: https%3A%2F%2Fdocs.mapbox.com%2Fapi%2Fimg%2Fcustom-marker.png',
      ],
      result:
        'url-https%3A%2F%2Fdocs.mapbox.com%2Fapi%2Fimg%2Fcustom-marker.png(-76.9,38.9)',
    },
  ],
  parameters: markerParams.map((p) => p.codaDef) as coda.ParamDefs,
  execute: async function (params) {
    populateParams(params, markerParams);

    let coords: string = `(${LonParam.getValue()},${LatParam.getValue()})`;
    let label: string = MarkerLabelParam.meetsConditions()
      ? `-${MarkerLabelParam.getValue()}`
      : '';
    let color: string = MarkerColorParam.meetsConditions()
      ? `+${MarkerColorParam.getValue()}`
      : '';
    let customMarker = `url-${CustomMarkerParam.getValue()}`;
    let marker = `${MarkerSizeParam.getValue() + label + color}`;

    return (
      (CustomMarkerParam.meetsConditions() ? customMarker : marker) + coords
    );
  },
});
