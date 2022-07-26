import * as coda from '@codahq/packs-sdk';

export const StepManeuverSchema = coda.makeObjectSchema({
  properties: {
    bearing_before: {type: coda.ValueType.Number},
    bearing_after: {type: coda.ValueType.Number},
    instruction: {type: coda.ValueType.String},
    location: {
      type: coda.ValueType.Array,
      items: coda.makeSchema({
        type: coda.ValueType.Array,
        items: {type: coda.ValueType.Number},
      }),
    },
    modifier: {type: coda.ValueType.String},
    type: {type: coda.ValueType.String},
  },
  displayProperty: 'instruction',
});

export const RouteStepSchema = coda.makeObjectSchema({
  properties: {
    maneuver: StepManeuverSchema,
    duration: {
      type: coda.ValueType.Number,
      description:
        'The estimated travel time through the waypoints, in seconds.',
    },
    distance: {
      type: coda.ValueType.Number,
      description: 'The distance traveled through the waypoints, in meters.',
    },
    weight: {
      type: coda.ValueType.String,
      description: 'The weight in units described by weight_name.',
    },
    geometry: {
      type: coda.ValueType.String,
      description:
        'Depending on the geometries query parameter, this is either a GeoJSON LineString or a Polyline string. Depending on the overview query parameter, this is the complete route geometry (full), a simplified geometry to the zoom level at which the route can be displayed in full (simplified), or is not included (false).',
    },
    name: {type: coda.ValueType.String},
    mode: {type: coda.ValueType.String},
  },
  displayProperty: 'name',
});

export const RouteLegSchema = coda.makeObjectSchema({
  properties: {
    duration: {
      type: coda.ValueType.Number,
      description:
        'The estimated travel time through the waypoints, in seconds.',
    },
    distance: {
      type: coda.ValueType.Number,
      description: 'The distance traveled through the waypoints, in meters.',
    },
    weight: {
      type: coda.ValueType.String,
      description: 'The weight in units described by weight_name.',
    },
    steps: {type: coda.ValueType.Array, items: RouteStepSchema},
    summary: {
      type: coda.ValueType.String,
      description: 'A summary of the route.',
    },
  },
});

export const RouteSchema = coda.makeObjectSchema({
  properties: {
    duration: {
      type: coda.ValueType.Number,
      description:
        'The estimated travel time through the waypoints, in seconds.',
    },
    distance: {
      type: coda.ValueType.Number,
      description: 'The distance traveled through the waypoints, in meters.',
    },
    weight_name: {
      type: coda.ValueType.String,
      description:
        'The weight used. The default is routability, which is duration-based, with additional penalties for less desirable maneuvers.',
    },
    weight: {
      type: coda.ValueType.String,
      description: 'The weight in units described by weight_name.',
    },
    duration_typical: {
      type: coda.ValueType.Number,
    },
    weight_typical: {
      type: coda.ValueType.Number,
    },
    geometry: {
      type: coda.ValueType.String,
      description:
        'Depending on the geometries query parameter, this is either a GeoJSON LineString or a Polyline string. Depending on the overview query parameter, this is the complete route geometry (full), a simplified geometry to the zoom level at which the route can be displayed in full (simplified), or is not included (false).',
    },
    legs: {type: coda.ValueType.Array, items: RouteLegSchema},
  },
});

export const WaypointSchema = coda.makeObjectSchema({
  properties: {
    name: {type: coda.ValueType.String},
    location: {
      type: coda.ValueType.Array,
      items: coda.makeSchema({
        type: coda.ValueType.Array,
        items: {type: coda.ValueType.Number},
      }),
    },
    distance: {type: coda.ValueType.Number},
  },
  displayProperty: 'name',
});

export const DirectionsResponseSchema = coda.makeObjectSchema({
  properties: {
    code: {type: coda.ValueType.String},
    waypoints: {type: coda.ValueType.Array, items: WaypointSchema},
    routes: {type: coda.ValueType.Array, items: RouteSchema},
  },
  displayProperty: 'routes',
});
