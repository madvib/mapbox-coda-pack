import * as coda from '@codahq/packs-sdk';
import {CountryCodes, makiIcons, MapboxPlaceTypes} from '../params/constants';

export const getOptions = coda.makeFormula({
  name: 'GetOptions',
  description:
    'Access possible options for various parameters, see autocomplete for available parameters. Recommended to pair with controls such as a single or multi-select.',
  resultType: coda.ValueType.Array,
  items: {type: coda.ValueType.String},
  examples: [
    {
      params: ['place_type'],
      result: ['poi', 'address', '...'],
    },
  ],
  parameters: [
    coda.makeParameter({
      name: 'parameter',
      description: 'Select the parameter to fetch possible options for',
      type: coda.ParameterType.String,
      autocomplete: ['place_type', 'icons', 'country_codes'],
    }),
  ],
  execute: async ([param]) => {
    switch (param) {
      case 'place_type':
        return MapboxPlaceTypes;
      case 'maki_icons':
        return makiIcons;
      case 'country_codes':
        return Object.keys(CountryCodes);
      default:
        break;
    }
  },
});
