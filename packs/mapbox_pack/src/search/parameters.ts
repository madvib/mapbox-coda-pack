import * as coda from '@codahq/packs-sdk';
import {UnionType} from '@codahq/packs-sdk/dist/api_types';
import {MapboxPlaceTypes} from '../shared/params/constants';
import {BboxParamOptions, Param, ParamOptions} from '../shared/params/param';
import {coordinatePairMatcher} from '../shared/utility_functions';
import {autocompleteGeocode} from './formulas/geocode';

const WorldViews = ['cn', 'in', 'jp', 'us'];

type GeoParamOptions<T, C extends UnionType> = ParamOptions<T, C> & {
  forwardGeocode?: boolean;
  reverseGeocode?: boolean;
};

export class GeoParam<T, C extends UnionType> extends Param<T, C> {
  forwardGeocode: boolean = true;
  reverseGeocode: boolean = true;

  constructor(options: GeoParamOptions<T, C>) {
    super(options);
    if (typeof options.forwardGeocode === 'boolean')
      this.forwardGeocode = options.forwardGeocode;
    if (typeof options.reverseGeocode === 'boolean')
      this.reverseGeocode = options.reverseGeocode;
  }
}

export const SearchTextParam = new GeoParam<string, coda.Type.string>({
  key: null,
  rules: (text) => [typeof text === 'string'],
  formatValue: (arg: string) => arg.substring(0, 256),
  codaDef: coda.makeParameter({
    type: coda.ParameterType.String,
    name: 'query',
    description:
      'The feature you’re trying to look up. This could be an address, a point of interest name, a city name, etc. ',
    autocomplete: autocompleteGeocode,
  }),
});

export const AutocompleteParam = new GeoParam<boolean, coda.Type.boolean>({
  key: 'autocomplete',
  reverseGeocode: false,
  codaDef: coda.makeParameter({
    type: coda.ParameterType.Boolean,
    name: 'autocomplete',
    description:
      'Specify whether to return autocomplete results (true, default) or not (false). When autocomplete is enabled, results will be included that start with the requested string, rather than just responses that match it exactly. Note this will result in more frequent requests.',
    optional: true,
    suggestedValue: true,
  }),
});

export const BboxGeoParam = new GeoParam<
  number[],
  coda.ArrayType<coda.Type.number>
>({
  ...BboxParamOptions,
  reverseGeocode: false,
});

export const CountryParam = new GeoParam<
  string[],
  coda.ArrayType<coda.Type.string>
>({
  key: 'country',
  formatValue: (arg) => arg.join(),
  rules: (value) => [
    Array.isArray(value) && value.every((e) => typeof e === 'string'),
  ],
  codaDef: coda.makeParameter({
    type: coda.ParameterType.StringArray,
    name: 'country',
    description:
      'Limit results to one or more countries. Permitted values are ISO 3166 alpha 2 country codes separated by commas.',
    optional: true,
  }),
});

export const FuzzyMatchParam = new GeoParam<boolean, coda.Type.boolean>({
  key: 'fuzzyMatch',
  reverseGeocode: false,
  codaDef: coda.makeParameter({
    type: coda.ParameterType.Boolean,
    name: 'fuzzyMatch',
    description:
      'Specify whether the Geocoding API should attempt approximate, as well as exact, matching when performing searches (true, default), or whether it should opt out of this behavior and only attempt exact matching (false). For example, the default setting might return Washington, DC for a query of wahsington, even though the query was misspelled.',
    optional: true,
    suggestedValue: true,
  }),
});
export const LanguageParam = new GeoParam<
  string[],
  coda.ArrayType<coda.Type.string>
>({
  key: 'language',
  formatValue: (arg) => arg.join(),
  rules: (val) => [
    Array.isArray(val) && val.every((e) => typeof e === 'string'),
  ],
  codaDef: coda.makeParameter({
    type: coda.ParameterType.StringArray,
    name: 'language',
    description:
      "Specify the user's Language.Options are IETF language tags comprised of a mandatory ISO 639-1 language code and, optionally, one or more IETF subtags for country or script.",
    optional: true,
  }),
});

const limitOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
export const LimitParam = new GeoParam<number, coda.Type.number>({
  key: 'limit',
  formatValue: (arg) => Math.trunc(arg),
  rules: (val) => [
    typeof val === 'number',
    limitOptions.includes(Math.trunc(val)),
  ],
  codaDef: coda.makeParameter({
    type: coda.ParameterType.Number,
    name: 'limit',
    description:
      'Specify the maximum number of results to return. The default is 5 and the maximum supported is 10.',
    optional: true,
    suggestedValue: 5,
    autocomplete: limitOptions,
  }),
});

export const ProximityParam = new GeoParam<string, coda.Type.string>({
  key: 'proximity',
  reverseGeocode: false,
  rules: (val) => [
    typeof val === 'string',
    val === 'ip' || coordinatePairMatcher.test(val),
  ],
  codaDef: coda.makeParameter({
    type: coda.ParameterType.String,
    name: 'proximity',
    description:
      'Bias the response to favor results that are closer to this location. Provided as two comma-separated coordinates in longitude,latitude order, or the string ip to bias based on reverse IP lookup.',
    optional: true,
    suggestedValue: 'ip',
  }),
});

export const RoutingParam = new GeoParam<boolean, coda.Type.boolean>({
  key: 'routing',
  codaDef: coda.makeParameter({
    type: coda.ParameterType.Boolean,
    name: 'routing',
    description:
      'Specify whether to request additional metadata about the recommended navigation destination corresponding to the feature (true) or not (false, default). Only applicable for address features.',
    optional: true,
    suggestedValue: false,
  }),
});

export const TypesParam = new GeoParam<
  string[],
  coda.ArrayType<coda.Type.string>
>({
  key: 'types',
  formatValue: (arg) => arg.join(),
  rules: (val) => [
    Array.isArray(val),
    val.every((e) => MapboxPlaceTypes.includes(e)),
  ],
  codaDef: coda.makeParameter({
    type: coda.ParameterType.StringArray,
    name: 'types',
    description:
      'Filter results to include only a subset (one or more) of the available feature types. Options are country, region, postcode, district, place, locality, neighborhood, address, and poi',
    optional: true,
  }),
});

export const WorldviewParam = new GeoParam<string, coda.Type.string>({
  key: 'worldview',
  rules: (text) => [typeof text === 'string'],
  codaDef: coda.makeParameter({
    type: coda.ParameterType.String,
    name: 'worldview',
    description:
      '	Returns features that are defined differently by audiences that belong to various regional, cultural, or political groups. Available worldviews are cn (China),in (India),jp (Japan), and us (United States)',
    optional: true,
    suggestedValue: 'us',
    autocomplete: WorldViews,
  }),
});

export const ReverseModeParam = new GeoParam<string, coda.Type.string>({
  forwardGeocode: false,
  key: 'reverseMode',
  rules: (val) => [
    typeof val === 'string',
    ['distance', 'score'].includes(val),
  ],
  codaDef: coda.makeParameter({
    type: coda.ParameterType.String,
    name: 'reverseMode',
    description:
      'Decides how results are sorted in a reverse geocoding query if multiple results are requested using a limit other than 1',
    optional: true,
    suggestedValue: 'distance',
    autocomplete: ['distance', 'score'],
  }),
});
