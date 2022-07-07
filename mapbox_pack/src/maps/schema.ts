import * as coda from '@codahq/packs-sdk';
import {GeoJsonFeatureSchema} from '../shared/schema';

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
        type: coda.ValueType.Array,
        items: {type: coda.ValueType.Number},
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
