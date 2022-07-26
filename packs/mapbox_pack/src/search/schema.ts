import * as coda from '@codahq/packs-sdk';
import {GeoJsonFeatureSchema, GeometrySchema} from '../shared/schema';

const CoordinatesSchema = coda.makeObjectSchema({
  properties: {
    coordinates: {
      type: coda.ValueType.Array,
      items: {type: coda.ValueType.Number},
    },
  },
});

const RouteablePointsSchema = coda.makeObjectSchema({
  properties: {
    points: {
      type: coda.ValueType.Array,
      items: coda.makeSchema({
        type: coda.ValueType.Array,
        items: CoordinatesSchema,
      }),
    },
  },
});
export const PlacesPropertiesSchema = coda.makeObjectSchema({
  properties: {
    accuracy: {type: coda.ValueType.String},
    address: {type: coda.ValueType.String},
    category: {type: coda.ValueType.String},
    maki: {type: coda.ValueType.String},
    wikidata: {type: coda.ValueType.String},
    short_code: {type: coda.ValueType.String},
  },
});

export var FeaturesSchema = coda.makeObjectSchema({
  idProperty: 'id',
  displayProperty: 'place_name',
  properties: {
    ...GeoJsonFeatureSchema.properties,
    place_type: {type: coda.ValueType.String},
    relevance: {type: coda.ValueType.Number},
    address: {type: coda.ValueType.String},
    properties: PlacesPropertiesSchema,
    text: {type: coda.ValueType.String},
    place_name: {type: coda.ValueType.String},
    matching_text: {type: coda.ValueType.String},
    matching_place_name: {type: coda.ValueType.String},
    //text_{language}:  {type: coda.ValueType.String},
    //place_name_{language}:{type: coda.ValueType.String},
    language: {type: coda.ValueType.String},
    //language_{language}: {type: coda.ValueType.String},
    bbox: {
      type: coda.ValueType.Array,
      items: coda.makeSchema({
        type: coda.ValueType.Array,
        items: {type: coda.ValueType.Number},
      }),
    },
    center: {
      type: coda.ValueType.Array,
      items: coda.makeSchema({
        type: coda.ValueType.Array,
        items: {type: coda.ValueType.Number},
      }),
    },
    // context: {
    //   type: coda.ValueType.Array,
    //   items: coda.makeSchema({
    //     type: coda.ValueType.Array,
    //     items: FeaturesSchema,
    //   }),
    // },
    routable_points: RouteablePointsSchema,
  },
});

export const GeocodingResponseSchema = coda.makeObjectSchema({
  properties: {
    type: {type: coda.ValueType.String},
    query: {type: coda.ValueType.String},
    features: {type: coda.ValueType.Array, items: FeaturesSchema},
    attribition: {type: coda.ValueType.String},
  },
  displayProperty: 'query',
});
