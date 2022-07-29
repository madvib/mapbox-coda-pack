import * as coda from '@codahq/packs-sdk';
import {autocompleteGeocode, geocode} from '../search/formulas/geocode';
import {BboxParamOptions, Param} from '../shared/params/param';
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
      'Choose one of three methods to position the camera for static image. "center": Determine position by passing coordinates, zoom, and optionally Pitch/Bearing, "bounding box": Set 4 coordinates to frame the image, "auto": Determines position automatically based on overlays or default center coordinates',
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

export const OverlayParam = new Param<coda.ParameterType.StringArray>({
  rules: (val) => [Array.isArray(val)],
  codaDef: coda.makeParameter({
    type: coda.ParameterType.StringArray,
    name: 'overlay',
    description:
      'One or more comma-separated features that can be applied on top of the map at request time. The order of features in an overlay dictates their Z-order on the page. The last item in the list will have the highest Z-order (will overlap the other features in the list), and the first item in the list will have the lowest (will underlap the other features). Format can be a mix of geojson, marker, or path. For more details on each option, see the Overlay options section.',
    optional: true,
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
      'Controls whether there is attribution on the image. Defaults to true. Note: If attribution=false, the watermarked attribution is removed from the image. You still have a legal responsibility to attribute maps that use OpenStreetMap data, which includes most maps from Mapbox. If you specify attribution=false, you are legally required to include proper attribution elsewhere on the webpage or document.',
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

export const LayerIdParam = new Param<coda.ParameterType.String>({
  rules: (text) => [typeof text === 'string'],
  codaDef: coda.makeParameter({
    type: coda.ParameterType.String,
    name: 'layer_id',
    description:
      'Denotes the layer in the style that the filter specified in setfilter is applied to.',
    optional: true,
  }),
});
export const PaddingParam = new Param<coda.ParameterType.StringArray>({
  useKey: true,
  rules: (val) => [val.length > 0, val.length < 5],
  formatValue: (val) => val.join(),
  codaDef: coda.makeParameter({
    type: coda.ParameterType.StringArray,
    name: 'padding',
    description:
      'Denotes the minimum padding per side of the image. This can only be used with auto or bbox. The value resembles the CSS specification for padding and accepts 1-4 integers without units. For example, padding=5 declares a minimum padding of 5 pixels for all sides, whereas padding=5,8,10,7 declares a minimum of 5 pixels of top padding, 8 pixels of right padding, 10 pixels of bottom padding, and 7 pixels of left padding. If auto is used but no value is specified in padding, the default padding will be used (a value that is 5% of the smallest side of the image, rounded up to the next integer value, up to a maximum of 12 pixels of padding per side).',
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
      'Display a title box with the map\'s title, owner, and a default message along the bottom of the map. Possible values are copy (message reads "Copy this style to your account" and provides a Copy button) and view (message reads "Design your own maps with Mapbox Studio" and provides a Sign Up button). The copy option will only work if a style\'s visibility is set to public. If this parameter is not used or its value is set to false, a title box is not displayed.',
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
      'The approximate distance to query for features, in meters. Defaults to 0, which performs a point-in-polygon query. Has no upper bound. Required for queries against point and line data. Due to the nature of tile buffering, a query with a large radius made against equally large point or line data may not include all possible features in the results. Queries will use tiles from the maximum zoom of the tileset, and will only include the intersecting tile plus eight surrounding tiles when searching for nearby features.',
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
      'Determines whether the features in the result will be deduplicated (true, default) or not (false). The Tilequery API assumes that features are duplicates if all of the following are true: the features are from the same layer; the features are the same geometry type; and the features have the same ID and the same properties (or just the same properties, if the features do not have IDs).',
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
