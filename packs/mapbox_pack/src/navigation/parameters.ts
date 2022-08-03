import * as coda from '@codahq/packs-sdk';
import {directionsExclude} from '../shared/params/constants';
import {Param} from '../shared/params/param';
import {rmSpacesLineBreaks as spacesLineBreaks} from '../shared/utility_functions';

export const ProfileParam = function (directions: boolean) {
  return new Param<coda.ParameterType.String>({
    rules: (val) => [typeof val === 'string'],
    codaDef: coda.makeParameter({
      type: coda.ParameterType.String,
      name: 'profile',
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

export const CoordinatesParam = new Param<coda.ParameterType.StringArray>({
  rules: (coords) => [coords.length > 1, coords.length <= 25],
  formatValue: (coords) => {
    const parseCoords = (val: string) =>
      parseFloat(val.split(',')[0]) >= -180 &&
      parseFloat(val.split(',')[0]) <= 180 &&
      parseFloat(val.split(',')[1]) >= -85.0511 &&
      parseFloat(val.split(',')[1]) <= 85.0511;
    //remove invalid coordinates and white space
    coords.filter(parseCoords);
    return coords.join(';').replace(spacesLineBreaks, '');
  },
  codaDef: coda.makeParameter({
    type: coda.ParameterType.StringArray,
    name: 'coordinates',
    description:
      'Longitude, Latitude coordinate pair. Latitude must be a number between -85.0511 and 85.0511 and Longitude must be between -180 and 180.',
    optional: true,
  }),
});

export const AlternativeRoutesParam = new Param<coda.ParameterType.Boolean>({
  useKey: true,
  codaDef: coda.makeParameter({
    name: 'alternatives',
    description:
      'Whether to try to return alternative routes (true) or not (false, default). An alternative route is a route that is significantly different from the fastest route, but also still reasonably fast. Such a route does not exist in all circumstances. Up to two alternatives may be returned. This is available for mapbox/driving-traffic, mapbox/driving, mapbox/cycling and mapbox/walking.',
    type: coda.ParameterType.Boolean,
    suggestedValue: false,
    optional: true,
  }),
});

export const ExcludeParam = function (profile: Param<any>) {
  return new Param<coda.ParameterType.StringArray>({
    useKey: true,
    formatValue: (arg) => {
      let availablevalues: string[];
      switch (profile.getValue()) {
        case 'walking':
          availablevalues = directionsExclude.filter((p) =>
            ['toll', 'motorway', 'unpaved'].includes(p)
          );
          break;
        case 'cycling':
          availablevalues = directionsExclude.filter((p) =>
            ['toll', 'motorway', 'unpaved', 'ferry'].includes(p)
          );
          break;
        default:
          availablevalues = directionsExclude;
          break;
      }
      return arg.filter((p) => availablevalues.includes(p)).join();
    },
    rules: (arg) => [arg.every((p) => typeof p === 'string')],
    codaDef: coda.makeParameter({
      name: 'exclude',
      description:
        'Exclude certain road types and custom locations from routing, nothing is excluded by default. You can specify multiple values as a comma-separated list. The following exclude values are available and can be retrieved using GetOptions("directions_exclude") formula: motorway, toll, ferry, unpaved, cash_only_tolls',
      type: coda.ParameterType.StringArray,
      optional: true,
    }),
  });
};

export const GeometriesParam = new Param<coda.ParameterType.String>({
  useKey: true,
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
export const OverviewParam = new Param<coda.ParameterType.String>({
  useKey: true,
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

export const ContourTypeParam = new Param<coda.ParameterType.String>({
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

export const ContoursParam = new Param<coda.ParameterType.NumberArray>({
  useKey:
    ContourTypeParam.getValue() === 'minutes'
      ? 'contours_minutes'
      : 'contours_meters',
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
    name: 'contours',
    description:
      'List defining up to four contours either as 1) times in minutes or 2) distances in meters, to use for each isochrone contour. Contours must be in increasing order. The maximum time that can be specified is 60 minutes.The maximum distance that can be specified is 100000 meters (100km).',
  }),
});

export const ContoursColorsParam = new Param<coda.ParameterType.StringArray>({
  useKey: true,
  rules: (val) => [val.every((p) => typeof p === 'string' && p.length === 6)],
  codaDef: coda.makeParameter({
    type: coda.ParameterType.StringArray,
    name: 'contours_colors',
    optional: true,
    description:
      'The colors to use for each isochrone contour, specified as hex values without a leading # (for example, ff0000 for red). If this parameter is used, there must be the same number of colors as there are entries in contours_minutes or contours_meters. If no colors are specified, the Isochrone API will assign a default rainbow color scheme to the output.',
  }),
});
export const PolygonsParam = new Param<coda.ParameterType.Boolean>({
  useKey: true,
  codaDef: coda.makeParameter({
    type: coda.ParameterType.Boolean,
    name: 'polygons',
    optional: true,
    suggestedValue: true,
    description:
      'Specify whether to return the contours as GeoJSON polygons (true) or linestrings (false, default). When polygons=true, any contour that forms a ring is returned as a polygon.',
  }),
});
export const DenoiseParam = new Param<coda.ParameterType.Number>({
  useKey: true,
  formatValue: (val) => val.toFixed(1),
  rules: (val) => [typeof val === 'number', val >= 0, val <= 1],
  codaDef: coda.makeParameter({
    type: coda.ParameterType.Number,
    name: 'denoise',
    description:
      'A floating point value from 0.0 to 1.0 that can be used to remove smaller contours. The default is 1.0. A value of 1.0 will only return the largest contour for a given value. A value of 0.5 drops any contours that are less than half the area of the largest contour in the set of contours for that same value.',
    optional: true,
    suggestedValue: 1,
  }),
});
export const GeneralizeParam = new Param<coda.ParameterType.Number>({
  useKey: true,
  formatValue: (val) => Math.trunc(val),
  rules: (val) => [typeof val === 'number', val >= 0],
  codaDef: coda.makeParameter({
    type: coda.ParameterType.Number,
    name: 'generalize',
    optional: true,
    description:
      'A positive floating point value, in meters, used as the tolerance for Douglas-Peucker generalization. There is no upper bound. If no value is specified in the request, the Isochrone API will choose the most optimized generalization to use for the request. Note that the generalization of contours can lead to self-intersections, as well as intersections of adjacent contours.',
  }),
});
