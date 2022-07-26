import * as coda from '@codahq/packs-sdk';
import {AnyRecord} from 'dns';
import {Param} from '../shared/params/param';

export const ProfileParam = function (directions: boolean) {
  return new Param<string, coda.Type.string>({
    key: undefined,
    default: 'driving',
    rules: (val) => [typeof val === 'string'],
    codaDef: coda.makeParameter({
      type: coda.ParameterType.String,
      name: 'Profile',
      description: 'A Mapbox Direction routing profile ID.',
      suggestedValue: 'driving',
      autocomplete: [
        'driving',
        'walking',
        'cycling',
        directions ? 'driving-traffic' : undefined,
      ],
    }),
  });
};

export const AlternativeRoutesParam = new Param<boolean, coda.Type.boolean>({
  key: 'alternatives',
  default: false,
  codaDef: coda.makeParameter({
    name: 'alternatives',
    description:
      'Whether to try to return alternative routes (true) or not (false, default). An alternative route is a route that is significantly different from the fastest route, but also still reasonably fast. Such a route does not exist in all circumstances. Up to two alternatives may be returned. This is available for mapbox/driving-traffic, mapbox/driving, mapbox/cycling and mapbox/walking.',
    type: coda.ParameterType.Boolean,
    suggestedValue: false,
    optional: true,
  }),
});

export const ExcludeParam = function (profile: Param<any, any>) {
  return new Param<string[], coda.ArrayType<coda.Type.string>>({
    key: 'exclude',
    formatValue: (arg) => {
      const allVals = [
        'motorway',
        'toll',
        'ferry',
        'unpaved',
        'cash_only_tolls',
      ];
      let availablevalues: string[];
      switch (profile.getValue()) {
        case 'walking':
          availablevalues = allVals.filter((p) =>
            ['toll', 'motorway', 'unpaved'].includes(p)
          );
          break;
        case 'cycling':
          availablevalues = allVals.filter((p) =>
            ['toll', 'motorway', 'unpaved', 'ferry'].includes(p)
          );
          break;
        default:
          availablevalues = allVals;
          break;
      }
      return arg.filter((p) => availablevalues.includes(p)).join();
    },
    rules: (arg) => [arg.every((p) => typeof p === 'string')],
    codaDef: coda.makeParameter({
      name: 'exclude',
      description:
        'Exclude certain road types and custom locations from routing. Default is to not exclude anything from the list below. You can specify multiple values as a comma-separated list. The following exclude values are available: motorway, toll, ferry, unpaved, cash_only_tolls',
      type: coda.ParameterType.StringArray,
      optional: true,
    }),
  });
};

export const GeometriesParam = new Param<string, coda.Type.string>({
  key: 'geometries',
  default: 'polyline',
  rules: (arg) => [['geojson', 'polyline', 'polyline6'].includes(arg)],
  codaDef: coda.makeParameter({
    name: 'geometries',
    description:
      'The format of the returned geometry. Allowed values are: geojson (as LineString), polyline (default, a polyline with a precision of five decimal places), polyline6 (a polyline with a precision of six decimal places).',
    type: coda.ParameterType.String,
    optional: true,
    suggestedValue: 'polyline',
    autocomplete: ['geojson', 'polyline', 'polyline6'],
  }),
});
export const OverviewParam = new Param<string, coda.Type.string>({
  key: 'overview',
  default: 'simplified',
  rules: (arg) => [['full', 'simplified', 'false'].includes(arg)],
  codaDef: coda.makeParameter({
    name: 'overview',
    description:
      'Displays the requested type of overview geometry. Can be full (the most detailed geometry available), simplified (default, a simplified version of the full geometry), or false (no overview geometry).',
    type: coda.ParameterType.String,
    optional: true,
    suggestedValue: 'simplified',
    autocomplete: ['full', 'simplified', 'false'],
  }),
});

export const ContourTypeParam = new Param<string, coda.Type.string>({
  key: undefined,
  default: 'minutes',
  rules: (arg) => [['minutes', 'meters'].includes(arg)],
  codaDef: coda.makeParameter({
    name: 'ContourType',
    description: 'Specify whether to define contours in minutes or meters.',
    type: coda.ParameterType.String,
    optional: true,
    suggestedValue: 'minutes',
    autocomplete: ['minutes', 'meters'],
  }),
});

export const ContoursParam = new Param<
  number[],
  coda.ArrayType<coda.Type.number>
>({
  key:
    ContourTypeParam.getValue() === 'minutes'
      ? 'contours_minutes'
      : 'contours_meters',
  default: [15],
  formatValue: (val) => val.join(),
  rules: (val) => [
    val.every((p) =>
      typeof p === 'number' &&
      p >= 0 &&
      ContourTypeParam.getValue() === 'minutes'
        ? p <= 60
        : p <= 100000
    ),
    val.length <= 4,
  ],
  codaDef: coda.makeParameter({
    type: coda.ParameterType.NumberArray,
    suggestedValue: [15],
    optional: true,
    name: 'Contours',
    description:
      'Define up to four contours either as 1) times in minutes or 2) distances in meters, to use for each isochrone contour. Contours must be in increasing order. The maximum time that can be specified is 60 minutes.The maximum distance that can be specified is 100000 meters (100km).',
  }),
});

export const ContoursColorsParam = new Param<
  string[],
  coda.ArrayType<coda.Type.string>
>({
  key: 'contours_colors',
  rules: (val) => [val.every((p) => typeof p === 'string' && p.length === 6)],
  codaDef: coda.makeParameter({
    type: coda.ParameterType.StringArray,
    name: 'ContoursColors',
    optional: true,
    description:
      'The colors to use for each isochrone contour, specified as hex values without a leading # (for example, ff0000 for red). If this parameter is used, there must be the same number of colors as there are entries in contours_minutes or contours_meters. If no colors are specified, the Isochrone API will assign a default rainbow color scheme to the output.',
  }),
});
export const PolygonsParam = new Param<boolean, coda.Type.boolean>({
  key: 'polygons',
  default: true,
  codaDef: coda.makeParameter({
    type: coda.ParameterType.Boolean,
    name: 'Polgons',
    optional: true,
    suggestedValue: true,
    description:
      'Specify whether to return the contours as GeoJSON polygons (true) or linestrings (false, default). When polygons=true, any contour that forms a ring is returned as a polygon.',
  }),
});
export const DenoiseParam = new Param<number, coda.Type.number>({
  key: 'denoise',
  default: 1,
  formatValue: (val) => val.toFixed(1),
  rules: (val) => [typeof val === 'number', val >= 0, val <= 1],
  codaDef: coda.makeParameter({
    type: coda.ParameterType.Number,
    name: 'Denoise',
    optional: true,
    description:
      'A floating point value from 0.0 to 1.0 that can be used to remove smaller contours. The default is 1.0. A value of 1.0 will only return the largest contour for a given value. A value of 0.5 drops any contours that are less than half the area of the largest contour in the set of contours for that same value.',
  }),
});
export const GeneralizeParam = new Param<number, coda.Type.number>({
  key: 'generalize',
  formatValue: (val) => Math.trunc(val),
  rules: (val) => [typeof val === 'number', val >= 0],
  codaDef: coda.makeParameter({
    type: coda.ParameterType.Number,
    name: 'Generalize',
    optional: true,
    description:
      'A positive floating point value, in meters, used as the tolerance for Douglas-Peucker generalization. There is no upper bound. If no value is specified in the request, the Isochrone API will choose the most optimized generalization to use for the request. Note that the generalization of contours can lead to self-intersections, as well as intersections of adjacent contours.',
  }),
});
