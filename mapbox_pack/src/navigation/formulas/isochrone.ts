import * as coda from '@codahq/packs-sdk';

const ProfileOptions = [
  {display: 'Driving', value: 'mapbox/driving'},
  {display: 'Walking', value: 'mapbox/walking'},
  {display: 'Cycling', value: 'mapbox/cycling'},
];

export default coda.makeFormula({
  resultType: coda.ValueType.String,
  codaType: coda.ValueHintType.Embed,
  name: 'Isochrone',
  description:
    'The Isochrone API allows you to request polygon or line features that show areas that are reachable within a specified amount of time from a location.',
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: 'Profile',
      description: 'A Mapbox Direction routing profile ID.',
      suggestedValue: 'mapbox/driving',
      autocomplete: ProfileOptions,
    }),
    coda.makeParameter({
      type: coda.ParameterType.Number,
      name: 'Coordinates',
      description:
        'A {longitude,latitude} coordinate pair around which to center the isochrone lines.',
    }),
    coda.makeParameter({
      type: coda.ParameterType.Number,
      suggestedValue: 15,
      name: 'Contours Minutes',
      description:
        '	The times, in minutes, to use for each isochrone contour. You can specify up to four contours. Times must be in increasing order. The maximum time that can be specified is 60 minutes.',
    }),
    coda.makeParameter({
      type: coda.ParameterType.Number,
      name: 'Contours Meters',
      optional: true,
      description:
        'The distances, in meters, to use for each isochrone contour. You can specify up to four contours. Distances must be in increasing order. The maximum distance that can be specified is 100000 meters (100km).',
    }),
    coda.makeParameter({
      type: coda.ParameterType.Number,
      name: 'Contours Colors',
      optional: true,
      description:
        'The colors to use for each isochrone contour, specified as hex values without a leading # (for example, ff0000 for red). If this parameter is used, there must be the same number of colors as there are entries in contours_minutes or contours_meters. If no colors are specified, the Isochrone API will assign a default rainbow color scheme to the output.',
    }),
    coda.makeParameter({
      type: coda.ParameterType.Boolean,
      name: 'Polgons',
      optional: true,
      description:
        'Specify whether to return the contours as GeoJSON polygons (true) or linestrings (false, default). When polygons=true, any contour that forms a ring is returned as a polygon.',
    }),
    coda.makeParameter({
      type: coda.ParameterType.Number,
      name: 'Denoise',
      optional: true,
      description:
        'A floating point value from 0.0 to 1.0 that can be used to remove smaller contours. The default is 1.0. A value of 1.0 will only return the largest contour for a given value. A value of 0.5 drops any contours that are less than half the area of the largest contour in the set of contours for that same value.',
    }),
    coda.makeParameter({
      type: coda.ParameterType.Number,
      name: 'Generalize',
      optional: true,
      description:
        'A positive floating point value, in meters, used as the tolerance for Douglas-Peucker generalization. There is no upper bound. If no value is specified in the request, the Isochrone API will choose the most optimized generalization to use for the request. Note that the generalization of contours can lead to self-intersections, as well as intersections of adjacent contours.',
    }),
  ],
  // Everything inside this execute statement will happen anytime your Coda
  // formula is called in a doc. An array of all user inputs is always the 1st
  // parameter.
  execute: async function ([profile], context) {
    const profiles = ProfileOptions.map((v) => v.value);
    if (!profiles.includes(profile)) {
      throw new coda.UserVisibleError('Unrecognized profile: ' + profile);
    }
    return 'Hello ' + profile + '!';
  },
});
