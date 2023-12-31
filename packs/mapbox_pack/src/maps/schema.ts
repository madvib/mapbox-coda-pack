import * as coda from '@codahq/packs-sdk';
import {GeoJsonFeatureSchema, GeometrySchema} from '../shared/schema';

export const DatasetSchema = coda.makeObjectSchema({
  displayProperty: 'name',
  idProperty: 'id',
  properties: {
    owner: {
      type: coda.ValueType.String,
      description: 'The username of the dataset owner.',
    },
    id: {
      type: coda.ValueType.String,
      description: 'The ID for an existing dataset.',
    },
    created: {
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.DateTime,
      description: 'A timestamp indicating when the dataset was created.',
    },
    modified: {
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.DateTime,
      description: 'A timestamp indicating when the dataset was last modified.',
    },
    bounds: {
      type: coda.ValueType.Array,
      description:
        'The extent of features in the dataset in the format [west, south, east, north].',
      items: coda.makeSchema({
        type: coda.ValueType.Number,
      }),
    },
    features: {
      type: coda.ValueType.Number,
      description: 'The number of features in the dataset.',
    },
    size: {
      type: coda.ValueType.Number,
      description: 'The size of the dataset in bytes.',
    },
    name: {
      type: coda.ValueType.String,
      description: 'The name of the dataset.',
    },
    description: {
      type: coda.ValueType.String,
      description: 'A description of the dataset.',
    },
  },
});

export const ListStylesSchema = coda.makeObjectSchema({
  properties: {
    version: {type: coda.ValueType.Number},
    name: {type: coda.ValueType.String},
    created: {
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.DateTime,
      description: 'A timestamp indicating when the dataset was created.',
    },
    modified: {
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.DateTime,
      description: 'A timestamp indicating when the dataset was last modified.',
    },
    id: {type: coda.ValueType.String},
    owner: {type: coda.ValueType.String},
    //TODO more props available
  },
  displayProperty: 'name',
  idProperty: 'id',
});

export const TilesetSchema = coda.makeObjectSchema({
  properties: {
    type: {
      type: coda.ValueType.String,
      description: 'The kind of data contained, either raster or vector.',
    },
    center: {
      type: coda.ValueType.Array,
      description:
        'The longitude, latitude, and zoom level for the center of the contained data, given in the format [lon, lat, zoom].',
      items: {type: coda.ValueType.Number},
    },
    description: {
      type: coda.ValueType.String,
      description: 'A human-readable description of the tileset.',
    },
    filesize: {
      type: coda.ValueType.Number,
      description: 'The storage in bytes consumed by the tileset.',
    },
    id: {
      type: coda.ValueType.String,
      description: 'The unique identifier for the tileset.',
    },
    created: {
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.DateTime,
      description: 'A timestamp indicating when the dataset was created.',
    },
    modified: {
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.DateTime,
      description: 'A timestamp indicating when the dataset was last modified.',
    },
    name: {
      type: coda.ValueType.String,
      description: 'The name of the tileset.',
    },
    visibility: {
      type: coda.ValueType.String,
      description:
        'The access control for the tileset, either public or private.',
    },
    status: {
      type: coda.ValueType.String,
      description:
        "The processing status of the tileset, one of: available, pending, or invalid. For tilesets created with the Mapbox Tiling Service, this is always set to available. To see the stage of a MTS tileset's most recent job, use the tileset jobs listing endpoint with a limit=1 query parameter.",
    },
  },
  displayProperty: 'name', // Which property above to display by default.
  idProperty: 'id',
});

export const TilequeryPropertiesSchema = coda.makeObjectSchema({
  displayProperty: 'distance',
  properties: {
    distance: {type: coda.ValueType.Number},
    geometry: {type: coda.ValueType.String},
    layer: {type: coda.ValueType.String},
  },
});

export const PropsSchema = coda.makeObjectSchema({
  displayProperty: 'tilequery',
  properties: {
    tilequery: TilequeryPropertiesSchema,
  },
});

export const TilequeryFeatureSchema = coda.makeObjectSchema({
  displayProperty: 'type',
  idProperty: 'id',
  properties: {
    geometry: GeometrySchema,
    type: {type: coda.ValueType.String},
    id: {type: coda.ValueType.Number},
    properties: PropsSchema,
  },
});
export const TilequeryResultSchema = coda.makeObjectSchema({
  displayProperty: 'type',
  properties: {
    type: {type: coda.ValueType.String},
    features: {type: coda.ValueType.Array, items: TilequeryFeatureSchema},
  },
});
