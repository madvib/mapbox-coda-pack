import * as coda from '@codahq/packs-sdk';
import {BboxParamOptions, Param} from '../shared/param';
import {autocompleteStyles} from './formulas/styles';

export const TokenParam = new Param<string, coda.Type.string>({
  key: undefined,
  rules: (text) => {
    return [typeof text === 'string'];
  },
  codaDef: coda.makeParameter({
    type: coda.ParameterType.String,
    name: 'token',
    description:
      "Specify a public token for client-exposed functions (Embed). Defaults to your account's default public token, but you can specify a (public) token from your account or create a temp token using the { GenerateToken } formula.",
    optional: true,
  }),
});

export const StyleParam = new Param<string, coda.Type.string>({
  key: undefined,
  rules: (text) => [typeof text === 'string'],
  default: 'mapbox/streets-v11',
  codaDef: coda.makeParameter({
    type: coda.ParameterType.String,
    name: 'style',
    description: 'The style for your map, defaults to Mapbox Streets.',
    suggestedValue: 'mapbox/streets-v11',
    autocomplete: autocompleteStyles,
    optional: true,
  }),
});

export const OverlayParam = new Param<string, coda.Type.string>({
  key: undefined,
  rules: (text) => [typeof text === 'string'],
  codaDef: coda.makeParameter({
    type: coda.ParameterType.String,
    name: 'overlay',
    description:
      'One or more comma-separated features that can be applied on top of the map at request time. The order of features in an overlay dictates their Z-order on the page. The last item in the list will have the highest Z-order (will overlap the other features in the list), and the first item in the list will have the lowest (will underlap the other features). Format can be a mix of geojson, marker, or path. For more details on each option, see the Overlay options section.',
    optional: true,
  }),
});

export const LonParam = new Param<number, coda.Type.number>({
  key: undefined,
  rules: (val) => [typeof val === 'number' && val >= -180 && val <= 180],
  codaDef: coda.makeParameter({
    type: coda.ParameterType.Number,
    name: 'lon',
    description:
      'Longitude for the center point of the static map; a number between -180 and 180.',
    optional: true,
  }),
});

export const LatParam = new Param<number, coda.Type.number>({
  key: undefined,
  rules: (val) => [typeof val === 'number', val >= -85.0511, val <= 85.0511],
  codaDef: coda.makeParameter({
    type: coda.ParameterType.Number,
    name: 'lat',
    description:
      'Latitude for the center point of the static map; a number between -85.0511 and 85.0511.',
    optional: true,
  }),
});

export const ZoomParam = new Param<number, coda.Type.number>({
  key: undefined,
  rules: (val) => [typeof val === 'number' && val >= 0 && val <= 22],
  codaDef: coda.makeParameter({
    type: coda.ParameterType.Number,
    name: 'zoom',
    description:
      'Zoom level; a number between 0 and 22. Fractional zoom levels will be rounded to two decimal places.',
    optional: true,
  }),
});

export const MapBboxParam = new Param<
  number[],
  coda.ArrayType<coda.Type.number>
>({
  //TODO better description?
  ...BboxParamOptions,
});

export const AutoParam = new Param<string, coda.Type.string>({
  key: undefined,
  rules: (text) => [typeof text === 'string'],

  codaDef: coda.makeParameter({
    type: coda.ParameterType.String,
    name: 'auto',
    description:
      'If auto is used, the viewport will fit the bounds of the overlay. If used, auto replaces lon, lat, zoom, bearing, pitch, and bbox. If auto is used without a specified padding value, padding will automatically be applied with a value that is 5% of the smallest side of the image, rounded up to the next integer value, up to a maximum of 12 pixels of padding per side.',
    optional: true,
  }),
});

export const WidthParam = new Param<number, coda.Type.number>({
  key: undefined,
  rules: (val) => [typeof val === 'number' && val >= 1 && val <= 1280],
  codaDef: coda.makeParameter({
    type: coda.ParameterType.Number,
    name: 'width',
    description: 'Width of the image; a number between 1 and 1280 pixels.',
    optional: true,
  }),
});

export const HeightParam = new Param<number, coda.Type.number>({
  key: undefined,
  rules: (val) => [typeof val === 'number' && val >= 1 && val <= 1280],
  codaDef: coda.makeParameter({
    type: coda.ParameterType.Number,
    name: 'height',
    description: 'Height of the image; a number between 1 and 1280 pixels.',
    optional: true,
  }),
});

export const BearingParam = new Param<number, coda.Type.number>({
  key: undefined,
  rules: (val) => [typeof val === 'number' && val >= 0 && val <= 360],
  codaDef: coda.makeParameter({
    type: coda.ParameterType.Number,
    name: 'bearing',
    description:
      'Bearing rotates the map around its center. A number between 0 and 360, interpreted as decimal degrees. 90 rotates the map 90° clockwise, while 180 flips the map. Defaults to 0.',
    optional: true,
  }),
});

export const PitchParam = new Param<number, coda.Type.number>({
  key: undefined,
  rules: (val) => [typeof val === 'number' && val >= 0 && val <= 60],
  codaDef: coda.makeParameter({
    type: coda.ParameterType.Number,
    name: 'pitch',
    description:
      'Pitch tilts the map, producing a perspective effect. A number between 0 and 60, measured in degrees. Defaults to 0 (looking straight down at the map).',
    optional: true,
  }),
});

export const TwoXParam = new Param<string, coda.Type.string>({
  key: undefined,
  rules: (text) => [typeof text === 'string'],

  codaDef: coda.makeParameter({
    type: coda.ParameterType.String,
    name: '@2x',
    description:
      'Render the static map at a @2x scale factor for high-density displays.',
    optional: true,
  }),
});

export const AttributionParam = new Param<boolean, coda.Type.boolean>({
  key: undefined,
  default: true,
  codaDef: coda.makeParameter({
    type: coda.ParameterType.Boolean,
    name: 'attribution',
    description:
      'Controls whether there is attribution on the image. Defaults to true. Note: If attribution=false, the watermarked attribution is removed from the image. You still have a legal responsibility to attribute maps that use OpenStreetMap data, which includes most maps from Mapbox. If you specify attribution=false, you are legally required to include proper attribution elsewhere on the webpage or document.',
    optional: true,
  }),
});
export const LogoParam = new Param<boolean, coda.Type.boolean>({
  key: undefined,
  default: true,
  codaDef: coda.makeParameter({
    type: coda.ParameterType.Boolean,
    name: 'logo',
    description:
      'Controls whether there is a Mapbox logo on the image. Defaults to true.',
    optional: true,
  }),
});

export const BeforeLayerParam = new Param<string, coda.Type.string>({
  key: undefined,
  rules: (text) => [typeof text === 'string'],
  codaDef: coda.makeParameter({
    type: coda.ParameterType.String,
    name: 'before_layer',
    description:
      'Controls where the overlay is inserted in the style. All overlays will be inserted before the specified layer.',
    optional: true,
  }),
});

//  // TODO evaluate fobject param
// export const AddLayerParam = new Param<string[], coda.Type.object>({
//   key: undefined,
//   formatValue: (arg) => arg.join(),
//   validate: (value) =>
//     Array.isArray(value) && value.every((e) => typeof e === 'string'),
//   codaDef: coda.makeParameter({
//     type: coda.ParameterType.StringArray,
//     name: 'setFilter',
//     description:
//       "Applies a filter to an existing layer in a style using Mapbox's expression syntax. Must be used with layer_id. See Style Parameters for more information.",
//     optional: true,
//   }),
// });

export const SetFilterParam = new Param<
  string[],
  coda.ArrayType<coda.Type.string>
>({
  key: undefined,
  //TODO evaluate formatter and validator
  formatValue: (arg) => arg.join(),
  rules: (value) => [
    Array.isArray(value) && value.every((e) => typeof e === 'string'),
  ],
  codaDef: coda.makeParameter({
    type: coda.ParameterType.StringArray,
    name: 'setFilter',
    description:
      "Applies a filter to an existing layer in a style using Mapbox's expression syntax. Must be used with layer_id. See Style Parameters for more information.",
    optional: true,
  }),
});

export const LayerIdParam = new Param<string, coda.Type.string>({
  key: undefined,
  rules: (text) => [typeof text === 'string'],
  codaDef: coda.makeParameter({
    type: coda.ParameterType.String,
    name: 'layer_id',
    description:
      'Denotes the layer in the style that the filter specified in setfilter is applied to.',
    optional: true,
  }),
});
export const PaddingParam = new Param<string, coda.Type.string>({
  key: undefined,
  rules: (text) => [typeof text === 'string'],
  codaDef: coda.makeParameter({
    type: coda.ParameterType.String,
    name: 'padding',
    description:
      'Denotes the minimum padding per side of the image. This can only be used with auto or bbox. The value resembles the CSS specification for padding and accepts 1-4 integers without units. For example, padding=5 declares a minimum padding of 5 pixels for all sides, whereas padding=5,8,10,7 declares a minimum of 5 pixels of top padding, 8 pixels of right padding, 10 pixels of bottom padding, and 7 pixels of left padding. If auto is used but no value is specified in padding, the default padding will be used (a value that is 5% of the smallest side of the image, rounded up to the next integer value, up to a maximum of 12 pixels of padding per side).',
    optional: true,
  }),
});

export const DraftParam = new Param<boolean, coda.Type.boolean>({
  key: undefined,
  default: false,
  codaDef: coda.makeParameter({
    type: coda.ParameterType.Boolean,
    name: 'draft',
    description: 'Retrieve the draft version of a style.',
    optional: true,
  }),
});

export const ZoomWheelParam = new Param<boolean, coda.Type.boolean>({
  key: 'zoomWheel',
  default: true,
  codaDef: coda.makeParameter({
    type: coda.ParameterType.Boolean,
    name: 'zoomWheel',
    description:
      'Whether to provide a zoomwheel, which enables a viewer to zoom in and out of the map using the mouse (true, default), or not (false).',
    optional: true,
  }),
});
export const TitleParam = new Param<string, coda.Type.string>({
  key: 'title',
  rules: (text) => [typeof text === 'string'],
  codaDef: coda.makeParameter({
    type: coda.ParameterType.String,
    name: 'title',
    description:
      'Display a title box with the map\'s title, owner, and a default message along the bottom of the map. Possible values are copy (message reads "Copy this style to your account" and provides a Copy button) and view (message reads "Design your own maps with Mapbox Studio" and provides a Sign Up button). The copy option will only work if a style\'s visibility is set to public. If this parameter is not used or its value is set to false, a title box is not displayed.',
    optional: true,
  }),
});
export const FallbackParam = new Param<boolean, coda.Type.boolean>({
  key: 'fallback',
  default: false,
  codaDef: coda.makeParameter({
    type: coda.ParameterType.Boolean,
    name: 'fallback',
    description: 'Serve a fallback raster map (true) or not (false, default).',
    optional: true,
  }),
});
export const MapboxGLVersionParam = new Param<string, coda.Type.string>({
  key: 'mapboxGLVersion',
  rules: (text) => [typeof text === 'string'],
  codaDef: coda.makeParameter({
    type: coda.ParameterType.String,
    name: 'mapboxGLVersion',
    description: 'Specify a version of Mapbox GL JS to use to render the map.',
    optional: true,
  }),
});
export const MapboxGLGeocoderVersionParam = new Param<string, coda.Type.string>(
  {
    key: 'mapboxGLGeocoderVersion',
    rules: (text) => [typeof text === 'string'],
    codaDef: coda.makeParameter({
      type: coda.ParameterType.String,
      name: 'mapboxGLGeocoderVersion',
      description:
        'Specify a version of the Mapbox GL geocoder plugin to use to render the map search box.',
      optional: true,
    }),
  }
);

// export const HashParam = new Param<number, coda.Type.number>({
//   key: 'hash',
//   validate: (val) => {
//     let condition = typeof val === 'number' && val >= 0 && val <= 60;
//     validate(condition, 'height must be a number between 0 and 60');
//     return condition;
//   },
//   codaDef: coda.makeParameter({
//     type: coda.ParameterType.Number,
//     name: 'pitch',
//     description:
//       'Specify a zoom level and location for the map to center on, in the format #zoom/latitude/longitude/bearing/pitch. Bearing and pitch are optional, and both values will default to 0° if not specified. The hash is placed after the access_token in the request.',
//     optional: true,
//   }),
// });
