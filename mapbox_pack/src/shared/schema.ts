import * as coda from '@codahq/packs-sdk';

export const GeometrySchema = coda.makeObjectSchema({
  properties: {
    type: {type: coda.ValueType.String},
    coordinates: {
      type: coda.ValueType.Array,
      items: coda.makeSchema({
        type: coda.ValueType.Array,
        items: {type: coda.ValueType.Number},
      }),
    },
    interpolated: {type: coda.ValueType.Boolean},
    omitted: {type: coda.ValueType.Boolean},
  },
});

export const GeoJsonFeatureSchema = coda.makeObjectSchema({
  idProperty: 'id',
  displayProperty: 'type',
  properties: {
    geometry: GeometrySchema,
    id: {type: coda.ValueType.String},
    type: {type: coda.ValueType.String},
    properties: {type: coda.ValueType.String},
  },
});
