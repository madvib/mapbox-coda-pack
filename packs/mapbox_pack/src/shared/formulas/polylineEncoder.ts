import * as coda from '@codahq/packs-sdk';
import * as polyline from '@mapbox/polyline';

export const encodePolyline = coda.makeFormula({
  name: 'EncodePolyline',
  description:
    'Returns a string-encoded polyline from input list of coordinate (ordered lat,lng)',
  resultType: coda.ValueType.String,
  items: {type: coda.ValueType.String},
  examples: [
    {
      params: [
        [38.5, -120.2],
        [40.7, -120.95],
        [43.252, -126.453],
      ],
      result: '_p~iF~ps|U_ulLnnqC_mqNvxq`@',
    },
  ],
  parameters: [],
  varargParameters: [
    coda.makeParameter({
      name: 'coordinates',
      description: 'Lat/Long coordinate pair',
      type: coda.ParameterType.NumberArray,
    }),
  ],
  execute: async ([...params]) => {
    return polyline.encode(params);
  },
});
