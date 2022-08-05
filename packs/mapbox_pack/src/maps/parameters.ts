import * as coda from '@codahq/packs-sdk';
import {autocompleteGeocode, geocode} from '../search/formulas/geocode';
import {makiIcons} from '../shared/params/constants';
import {BboxParamOptions, Param} from '../shared/params/param';
import {hexColorMatcher, rmSpacesLineBreaks} from '../shared/utility_functions';
import {
  autocompleteLayersForStyle,
  autocompleteStyles,
} from './formulas/styles';
import {autocompleteTilesets} from './formulas/tilesets';

export const PositionParam = new Param<coda.ParameterType.String>({
  useKey: undefined,
  rules: (text) => [
    typeof text === 'string',
    text === 'auto' || text === 'center' || text === 'bounding box',
  ],

  codaDef: coda.makeParameter({
    type: coda.ParameterType.String,
    name: 'position',
    description:
      'Strategy to position camera. "center": Determine position by passing coordinates, zoom, and optionally Pitch/Bearing, "bounding box": Set 4 coordinates to frame the image, "auto": Determines position based on overlays or default center coordinates',
    autocomplete: ['center', 'auto', 'bounding box'],
  }),
});
export const SearchParam = new Param<coda.ParameterType.String>({
  codaDef: coda.makeParameter({
    type: coda.ParameterType.String,
    name: 'search',
    description:
      'Optionally search by placename instead of passing coordinates.',
    optional: true,
    autocomplete: autocompleteGeocode,
  }),
});

export const TokenParam = new Param<coda.ParameterType.String>({
  rules: (text) => [typeof text === 'string'],
  codaDef: coda.makeParameter({
    type: coda.ParameterType.String,
    name: 'token',
    description:
      "Specify a public token for client-exposed functions (Embed). Defaults to your account's default public token, but you can specify a (public) token from your account or create a temp token using the { GenerateToken } formula.",
    optional: true,
  }),
});

export const StyleParam = new Param<coda.ParameterType.String>({
  rules: (text) => [typeof text === 'string'],
  codaDef: coda.makeParameter({
    type: coda.ParameterType.String,
    name: 'style',
    description: 'The style for your map, defaults to Mapbox Streets.',
    suggestedValue: 'mapbox/streets-v11',
    autocomplete: autocompleteStyles,
    optional: true,
  }),
});

export const TilesetParam = new Param<coda.ParameterType.String>({
  rules: (text) => [typeof text === 'string'],
  codaDef: coda.makeParameter({
    type: coda.ParameterType.String,
    name: 'tileset',
    description:
      'The ID of the map being queried. To query multiple tilesets at the same time, use a comma-separated list of up to 15 tileset IDs.',
    suggestedValue: 'mapbox.mapbox-streets-v8',
    autocomplete: autocompleteTilesets,
    optional: true,
  }),
});

export const GeoJSONParam = new Param<coda.ParameterType.StringArray>({
  formatValue: (val) =>
    val.map((p) => {
      return `geojson(${encodeURIComponent(
        p.replace(rmSpacesLineBreaks, '')
      )})`;
    }),
  codaDef: coda.makeParameter({
    type: coda.ParameterType.StringArray,
    name: 'geoJsonOverlay',
    description:
      'Add a stringified geojson feature or feature set to Static Image. May fail if with a particularly large dataset such as a detailed Isochrone because of API limitations...https://docs.mapbox.com/api/maps/static-images/#overlay-options',
    optional: true,
    suggestedValue: [],
  }),
});
export const PinsParam = new Param<coda.ParameterType.StringArray>({
  formatValue: (val) => {
    if (typeof val === 'string') {
      return [val];
    }
    return val ? val : [];
  },
  codaDef: coda.makeParameter({
    type: coda.ParameterType.StringArray,
    name: 'markerOverlay',
    description:
      'Accepts a list of strings in the following format https://docs.mapbox.com/api/maps/static-images/#marker to add a marker overlay on top of a static image, recommended to use MarkerOverlay() formula',
    optional: true,
    suggestedValue: [],
  }),
});
export const PolylinesParam = new Param<coda.ParameterType.StringArray>({
  formatValue: (val) => {
    if (typeof val === 'string') {
      return [val];
    }
    return val ? val : [];
  },
  codaDef: coda.makeParameter({
    type: coda.ParameterType.StringArray,
    name: 'pathOverlay',
    description:
      'Accepts an encoded polyline to overlay on top of a static image, recommended to use PathOverlay() formula if need to encode a polyline within your doc',
    optional: true,
    suggestedValue: [],
  }),
});
export const ZoomParam = new Param<coda.ParameterType.Number>({
  rules: (val) => [typeof val === 'number' && val >= 0 && val <= 22],
  codaDef: coda.makeParameter({
    type: coda.ParameterType.Number,
    name: 'zoom',
    description:
      'Zoom level; a number between 0 and 22. Fractional zoom levels will be rounded to two decimal places.',
    optional: true,
    suggestedValue: 10,
  }),
});

export const MapBboxParam = new Param<coda.ParameterType.NumberArray>({
  //TODO better description?
  ...BboxParamOptions,
  useKey: false,
});

export const WidthParam = new Param<coda.ParameterType.Number>({
  rules: (val) => [typeof val === 'number' && val >= 1 && val <= 1280],
  codaDef: coda.makeParameter({
    type: coda.ParameterType.Number,
    name: 'width',
    description: 'Width of the image; a number between 1 and 1280 pixels.',
    optional: true,
    suggestedValue: 300,
  }),
});

export const HeightParam = new Param<coda.ParameterType.Number>({
  rules: (val) => [typeof val === 'number' && val >= 1 && val <= 1280],
  codaDef: coda.makeParameter({
    type: coda.ParameterType.Number,
    name: 'height',
    description: 'Height of the image; a number between 1 and 1280 pixels.',
    optional: true,
    suggestedValue: 200,
  }),
});

export const BearingParam = new Param<coda.ParameterType.Number>({
  rules: (val) => [typeof val === 'number' && val >= 0 && val <= 360],
  codaDef: coda.makeParameter({
    type: coda.ParameterType.Number,
    name: 'bearing',
    description:
      'Bearing rotates the map around its center. A number between 0 and 360, interpreted as decimal degrees. 90 rotates the map 90° clockwise, while 180 flips the map. Defaults to 0.',
    optional: true,
    suggestedValue: 0,
  }),
});

export const PitchParam = new Param<coda.ParameterType.Number>({
  rules: (val) => [typeof val === 'number' && val >= 0 && val <= 60],
  codaDef: coda.makeParameter({
    type: coda.ParameterType.Number,
    name: 'pitch',
    description:
      'Pitch tilts the map, producing a perspective effect. A number between 0 and 60, measured in degrees. Defaults to 0 (looking straight down at the map).',
    optional: true,
    suggestedValue: 0,
  }),
});

export const TwoXParam = new Param<coda.ParameterType.Boolean>({
  useKey: undefined,
  rules: (val) => [typeof val === 'boolean'],
  formatValue: (val) => (val ? '@2X' : ''),
  codaDef: coda.makeParameter({
    type: coda.ParameterType.Boolean,
    name: 'twoX',
    description:
      'Render the static map at a @2x scale factor for high-density displays.',
    optional: true,
    suggestedValue: false,
  }),
});

export const AttributionParam = new Param<coda.ParameterType.Boolean>({
  useKey: true,
  codaDef: coda.makeParameter({
    type: coda.ParameterType.Boolean,
    name: 'attribution',
    description:
      'If attribution=false, the watermarked attribution is removed from the image. If you specify attribution=false, you are legally required to include proper attribution elsewhere on the webpage or document.',
    optional: true,
    suggestedValue: true,
  }),
});
export const LogoParam = new Param<coda.ParameterType.Boolean>({
  useKey: true,
  codaDef: coda.makeParameter({
    type: coda.ParameterType.Boolean,
    name: 'logo',
    description:
      'Controls whether there is a Mapbox logo on the image. Defaults to true.',
    optional: true,
    suggestedValue: true,
  }),
});

export const BeforeLayerParam = new Param<coda.ParameterType.String>({
  useKey: true,
  rules: (text) => [typeof text === 'string'],
  codaDef: coda.makeParameter({
    type: coda.ParameterType.String,
    name: 'before_layer',
    description:
      'Controls where the overlay is inserted in the style. All overlays will be inserted before the specified layer.',
    optional: true,
    autocomplete: async (context, search, {style}) =>
      autocompleteLayersForStyle(context, style, search),
  }),
});

//  // TODO evaluate object param
// export const AddLayerParam = new Param<string[], coda.Type.object>({
//   key: undefined,
//   formatValue: (arg) => arg.join(),
//   validate: (value) =>
//     Array.isArray(value) && value.every((e) => typeof e === 'string'),
//   codaDef: coda.makeParameter({
//     type: coda.ParameterType.StringArray,
//     name: 'addLayer',
//     description:
//       "Applies a filter to an existing layer in a style using Mapbox's expression syntax. Must be used with layer_id. See Style Parameters for more information.",
//     optional: true,
//   }),
// });

// export const SetFilterParam = new Param<coda.ParameterType.StringArray>({
//   //TODO evaluate formatter and validator
//   formatValue: (arg) => arg.join(),
//   rules: (value) => [
//     Array.isArray(value) && value.every((e) => typeof e === 'string'),
//   ],
//   codaDef: coda.makeParameter({
//     type: coda.ParameterType.StringArray,
//     name: 'setFilter',
//     description:
//       "Applies a filter to an existing layer in a style using Mapbox's expression syntax. Must be used with layer_id. See Style Parameters for more information.",
//     optional: true,
//   }),
// });

// export const LayerIdParam = new Param<coda.ParameterType.String>({
//   rules: (text) => [typeof text === 'string'],
//   codaDef: coda.makeParameter({
//     type: coda.ParameterType.String,
//     name: 'layer_id',
//     description:
//       'Denotes the layer in the style that the filter specified in setfilter is applied to.',
//     optional: true,
//   }),
// });
export const PaddingParam = new Param<coda.ParameterType.StringArray>({
  useKey: true,
  rules: (val) => [val.length > 0, val.length < 5],
  formatValue: (val) => val.join(),
  codaDef: coda.makeParameter({
    type: coda.ParameterType.StringArray,
    name: 'padding',
    description:
      'Denotes the minimum padding per side of the image, can only be used with auto or bbox. Accepts 1-4 integers without units. For example with input of padding=5,8,10,7: top=5, right=8, bottom=10, and left=7 pixels.',
    optional: true,
  }),
});

export const DraftParam = new Param<coda.ParameterType.Boolean>({
  codaDef: coda.makeParameter({
    type: coda.ParameterType.Boolean,
    name: 'draft',
    description: 'Retrieve the draft version of a style.',
    optional: true,
    suggestedValue: false,
  }),
});

export const ZoomWheelParam = new Param<coda.ParameterType.Boolean>({
  useKey: true,
  codaDef: coda.makeParameter({
    type: coda.ParameterType.Boolean,
    name: 'zoomWheel',
    description:
      'Whether to provide a zoomwheel, which enables a viewer to zoom in and out of the map using the mouse (true, default), or not (false).',
    optional: true,
    suggestedValue: true,
  }),
});
export const TitleParam = new Param<coda.ParameterType.String>({
  useKey: true,
  rules: (text) => [typeof text === 'string'],
  codaDef: coda.makeParameter({
    type: coda.ParameterType.String,
    name: 'title',
    description:
      "Display a title box with the map's title, owner, and a default message. Possible values are copy (provides a Copy button) and view (provides a Sign Up button).",
    optional: true,
  }),
});
export const FallbackParam = new Param<coda.ParameterType.Boolean>({
  useKey: true,
  codaDef: coda.makeParameter({
    type: coda.ParameterType.Boolean,
    name: 'fallback',
    description: 'Serve a fallback raster map (true) or not (false, default).',
    optional: true,
    suggestedValue: false,
  }),
});

export const DatasetIdParam = new Param<coda.ParameterType.String>({
  rules: (text) => [typeof text === 'string'],
  codaDef: coda.makeParameter({
    type: coda.ParameterType.String,
    name: 'dataset_id',
    description:
      '	The ID of the dataset for which to insert or update features.',
    optional: false,
  }),
});

export const FeatureIdParam = new Param<coda.ParameterType.String>({
  rules: (text) => [typeof text === 'string'],
  codaDef: coda.makeParameter({
    type: coda.ParameterType.String,
    name: 'feature_id',
    description:
      'The ID of the dataset for which to insert or update features.',
    optional: false,
  }),
});
export const GeoJSONFeatureParam = new Param<coda.ParameterType.String>({
  rules: (text) => [typeof text === 'string'],
  codaDef: coda.makeParameter({
    type: coda.ParameterType.String,
    name: 'geoJSONFeature',
    description:
      'This should be one individual GeoJSON feature, not a GeoJSON FeatureCollection. If the GeoJSON feature has a top-level id property, it must match the feature_id parameter.',
    optional: false,
  }),
});

export const RadiusParam = new Param<coda.ParameterType.Number>({
  useKey: true,
  rules: (val) => [typeof val === 'number' && val >= 0],
  codaDef: coda.makeParameter({
    type: coda.ParameterType.Number,
    name: 'radius',
    description:
      'The approximate distance to query for features, in meters. Defaults to 0, which performs a point-in-polygon query. Has no upper bound. Required for queries against point and line data.',
    optional: true,
    suggestedValue: 0,
  }),
});
export const LimitParam = new Param<coda.ParameterType.Number>({
  useKey: true,
  rules: (val) => [typeof val === 'number' && val >= 0 && val <= 50],
  codaDef: coda.makeParameter({
    type: coda.ParameterType.Number,
    name: 'limit',
    description:
      'The number of features between 1-50 to return. Defaults to 5. The specified number of features are returned in order of their proximity to the queried {lon},{lat}.',
    optional: true,
    suggestedValue: 5,
  }),
});
export const DedupeParam = new Param<coda.ParameterType.Boolean>({
  useKey: true,
  codaDef: coda.makeParameter({
    type: coda.ParameterType.Boolean,
    name: 'dedupe',
    description:
      'Features are considered duplicates if all of the following are shared: layer; geometry type; ID and the same properties (or just the same properties, if the features do not have IDs).',
    suggestedValue: true,
    optional: true,
  }),
});

export const GeometryTypeParam = new Param<coda.ParameterType.String>({
  useKey: true,
  rules: (text) => [
    typeof text === 'string',
    ['polygon', 'linestring', 'point'].includes(text),
  ],
  codaDef: coda.makeParameter({
    type: coda.ParameterType.String,
    name: 'geometry',
    description:
      'Return only a specific geometry type. Options are polygon, linestring, or point. Defaults to returning all geometry types.',
    optional: true,
    autocomplete: ['polygon', 'linestring', 'point'],
  }),
});
export const LayersParam = new Param<coda.ParameterType.StringArray>({
  useKey: true,
  rules: (text) => [typeof text === 'string'],
  formatValue: (arg) => arg.join(),
  codaDef: coda.makeParameter({
    type: coda.ParameterType.StringArray,
    name: 'layers',
    description:
      '	A comma-separated list of layers to query, rather than querying all layers. If a specified layer does not exist, it is skipped. If no layers exist, returns an empty FeatureCollection.',
    optional: true,
  }),
});

export const MarkerSizeParam = new Param<coda.ParameterType.Boolean>({
  formatValue: (arg) => (arg ? 'pin-l' : 'pin-s'),
  codaDef: coda.makeParameter({
    type: coda.ParameterType.Boolean,
    name: 'large',
    description: 'Return a larger sized marker',
    optional: true,
    suggestedValue: false,
  }),
});
export const CustomMarkerParam = new Param<coda.ParameterType.String>({
  rules: (text) => [typeof text === 'string', text.length >= 1],
  formatValue: (arg) => {
    let uri = arg;
    return uri !== decodeURIComponent(uri) ? uri : encodeURIComponent(uri);
  },
  codaDef: coda.makeParameter({
    type: coda.ParameterType.String,
    name: 'customMarker',
    description:
      'Accepts a percent-encoded URL for a PNG or JPG image to be used as a custom marker for a static image.',
    optional: true,
  }),
});
export const MarkerLabelParam = new Param<coda.ParameterType.String>({
  rules: (text) => [
    typeof text === 'string',
    makiIcons.includes(text) || /([1-9]\d?|[a-z])/.test(text.toLowerCase()),
  ],
  formatValue: (arg) => arg.toLowerCase(),
  codaDef: coda.makeParameter({
    type: coda.ParameterType.String,
    name: 'label',
    description:
      'Marker label, valid values are single letters a-z, numbers 1-99, or a maki icon (available icons can be found using GetOptions() formula). ',
    optional: true,
  }),
});
export const MarkerColorParam = new Param<coda.ParameterType.String>({
  formatValue: (arg) => arg.replace('#', ''),
  rules: (text) => [typeof text === 'string', hexColorMatcher.test(text)],
  codaDef: coda.makeParameter({
    type: coda.ParameterType.String,
    name: 'color',
    description: 'Accepts valid 3 or 6 digit hex values.',
    optional: true,
  }),
});

export const StrokeWidthParam = new Param<coda.ParameterType.Number>({
  rules: (val) => [typeof val === 'number', val >= 0, val <= 16],
  codaDef: coda.makeParameter({
    type: coda.ParameterType.Number,
    name: 'strokeWidth',
    description: 'Accepts a number between 0 and 16',
    optional: true,
  }),
});
export const StrokeColorParam = new Param<coda.ParameterType.String>({
  formatValue: (arg) => arg.replace('#', ''),
  rules: (text) => [typeof text === 'string', hexColorMatcher.test(text)],
  codaDef: coda.makeParameter({
    type: coda.ParameterType.String,
    name: 'strokeColor',
    description: 'Accepts valid 3 or 6 digit hex values',
    optional: true,
  }),
});
export const StrokeOpacityParam = new Param<coda.ParameterType.Number>({
  rules: (val) => [typeof val === 'number'],
  codaDef: coda.makeParameter({
    type: coda.ParameterType.Number,
    name: 'strokeOpacity',
    description:
      'A number between 0 (transparent) and 1 (opaque) for line stroke opacity',
    optional: true,
  }),
});
export const FillColorParam = new Param<coda.ParameterType.String>({
  formatValue: (arg) => arg.replace('#', ''),
  rules: (text) => [typeof text === 'string', hexColorMatcher.test(text)],
  codaDef: coda.makeParameter({
    type: coda.ParameterType.String,
    name: 'fillColor',
    description: 'Accepts valid 3 or 6 digit hex values.',
    optional: true,
  }),
});
export const FillOpacityParam = new Param<coda.ParameterType.Number>({
  rules: (val) => [typeof val === 'number'],
  codaDef: coda.makeParameter({
    type: coda.ParameterType.Number,
    name: 'fillOpacity',
    description:
      'A number between 0 (transparent) and 1 (opaque) for line stroke opacity',
    optional: true,
  }),
});

export const PolylineParam = new Param<coda.ParameterType.String>({
  rules: (text) => [typeof text === 'string'],
  codaDef: coda.makeParameter({
    type: coda.ParameterType.String,
    name: 'polyline',
    description:
      'Accepts either an encoded polyline (i.e. "_p~iF~ps|U_ulLnnqC_mqNvxq`@") or a stringified list of [lat,lon] pairs ([[-120.2, 38.5], [-120.95, 40.7], [-126.453, 43.252]])',
  }),
});
