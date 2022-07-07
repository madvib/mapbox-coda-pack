import * as coda from '@codahq/packs-sdk';
import {UnionType} from '@codahq/packs-sdk/dist/api_types';
import {BboxParamOptions, Param, ParamOptions} from '../shared/param';
import {coordinatePairMatcher} from '../shared/utility_functions';

export const MapboxPlaceTypes = [
  'country',
  'region',
  'postcode',
  'district',
  'place',
  'locality',
  'neighborhood',
  'address',
  'poi',
];

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
  //TODO
  possibleValues: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
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

export const CountryCodes: {[key: string]: string} = {
  AF: 'Afghanistan',
  AX: 'Aland Islands',
  AL: 'Albania',
  DZ: 'Algeria',
  AS: 'American Samoa',
  AD: 'Andorra',
  AO: 'Angola',
  AI: 'Anguilla',
  AQ: 'Antarctica',
  AG: 'Antigua And Barbuda',
  AR: 'Argentina',
  AM: 'Armenia',
  AW: 'Aruba',
  AU: 'Australia',
  AT: 'Austria',
  AZ: 'Azerbaijan',
  BS: 'Bahamas',
  BH: 'Bahrain',
  BD: 'Bangladesh',
  BB: 'Barbados',
  BY: 'Belarus',
  BE: 'Belgium',
  BZ: 'Belize',
  BJ: 'Benin',
  BM: 'Bermuda',
  BT: 'Bhutan',
  BO: 'Bolivia',
  BA: 'Bosnia And Herzegovina',
  BW: 'Botswana',
  BV: 'Bouvet Island',
  BR: 'Brazil',
  IO: 'British Indian Ocean Territory',
  BN: 'Brunei Darussalam',
  BG: 'Bulgaria',
  BF: 'Burkina Faso',
  BI: 'Burundi',
  KH: 'Cambodia',
  CM: 'Cameroon',
  CA: 'Canada',
  CV: 'Cape Verde',
  KY: 'Cayman Islands',
  CF: 'Central African Republic',
  TD: 'Chad',
  CL: 'Chile',
  CN: 'China',
  CX: 'Christmas Island',
  CC: 'Cocos (Keeling) Islands',
  CO: 'Colombia',
  KM: 'Comoros',
  CG: 'Congo',
  CD: 'Congo, Democratic Republic',
  CK: 'Cook Islands',
  CR: 'Costa Rica',
  CI: 'Cote D"Ivoire',
  HR: 'Croatia',
  CU: 'Cuba',
  CY: 'Cyprus',
  CZ: 'Czech Republic',
  DK: 'Denmark',
  DJ: 'Djibouti',
  DM: 'Dominica',
  DO: 'Dominican Republic',
  EC: 'Ecuador',
  EG: 'Egypt',
  SV: 'El Salvador',
  GQ: 'Equatorial Guinea',
  ER: 'Eritrea',
  EE: 'Estonia',
  ET: 'Ethiopia',
  FK: 'Falkland Islands (Malvinas)',
  FO: 'Faroe Islands',
  FJ: 'Fiji',
  FI: 'Finland',
  FR: 'France',
  GF: 'French Guiana',
  PF: 'French Polynesia',
  TF: 'French Southern Territories',
  GA: 'Gabon',
  GM: 'Gambia',
  GE: 'Georgia',
  DE: 'Germany',
  GH: 'Ghana',
  GI: 'Gibraltar',
  GR: 'Greece',
  GL: 'Greenland',
  GD: 'Grenada',
  GP: 'Guadeloupe',
  GU: 'Guam',
  GT: 'Guatemala',
  GG: 'Guernsey',
  GN: 'Guinea',
  GW: 'Guinea-Bissau',
  GY: 'Guyana',
  HT: 'Haiti',
  HM: 'Heard Island & Mcdonald Islands',
  VA: 'Holy See (Vatican City State)',
  HN: 'Honduras',
  HK: 'Hong Kong',
  HU: 'Hungary',
  IS: 'Iceland',
  IN: 'India',
  ID: 'Indonesia',
  IR: 'Iran, Islamic Republic Of',
  IQ: 'Iraq',
  IE: 'Ireland',
  IM: 'Isle Of Man',
  IL: 'Israel',
  IT: 'Italy',
  JM: 'Jamaica',
  JP: 'Japan',
  JE: 'Jersey',
  JO: 'Jordan',
  KZ: 'Kazakhstan',
  KE: 'Kenya',
  KI: 'Kiribati',
  KR: 'Korea',
  KP: 'North Korea',
  KW: 'Kuwait',
  KG: 'Kyrgyzstan',
  LA: 'Lao People"s Democratic Republic',
  LV: 'Latvia',
  LB: 'Lebanon',
  LS: 'Lesotho',
  LR: 'Liberia',
  LY: 'Libyan Arab Jamahiriya',
  LI: 'Liechtenstein',
  LT: 'Lithuania',
  LU: 'Luxembourg',
  MO: 'Macao',
  MK: 'Macedonia',
  MG: 'Madagascar',
  MW: 'Malawi',
  MY: 'Malaysia',
  MV: 'Maldives',
  ML: 'Mali',
  MT: 'Malta',
  MH: 'Marshall Islands',
  MQ: 'Martinique',
  MR: 'Mauritania',
  MU: 'Mauritius',
  YT: 'Mayotte',
  MX: 'Mexico',
  FM: 'Micronesia, Federated States Of',
  MD: 'Moldova',
  MC: 'Monaco',
  MN: 'Mongolia',
  ME: 'Montenegro',
  MS: 'Montserrat',
  MA: 'Morocco',
  MZ: 'Mozambique',
  MM: 'Myanmar',
  NA: 'Namibia',
  NR: 'Nauru',
  NP: 'Nepal',
  NL: 'Netherlands',
  NC: 'New Caledonia',
  NZ: 'New Zealand',
  NI: 'Nicaragua',
  NE: 'Niger',
  NG: 'Nigeria',
  NU: 'Niue',
  NF: 'Norfolk Island',
  MP: 'Northern Mariana Islands',
  NO: 'Norway',
  OM: 'Oman',
  PK: 'Pakistan',
  PW: 'Palau',
  PS: 'Palestinian Territory, Occupied',
  PA: 'Panama',
  PG: 'Papua New Guinea',
  PY: 'Paraguay',
  PE: 'Peru',
  PH: 'Philippines',
  PN: 'Pitcairn',
  PL: 'Poland',
  PT: 'Portugal',
  PR: 'Puerto Rico',
  QA: 'Qatar',
  RE: 'Reunion',
  RO: 'Romania',
  RU: 'Russian Federation',
  RW: 'Rwanda',
  BL: 'Saint Barthelemy',
  SH: 'Saint Helena',
  KN: 'Saint Kitts And Nevis',
  LC: 'Saint Lucia',
  MF: 'Saint Martin',
  PM: 'Saint Pierre And Miquelon',
  VC: 'Saint Vincent And Grenadines',
  WS: 'Samoa',
  SM: 'San Marino',
  ST: 'Sao Tome And Principe',
  SA: 'Saudi Arabia',
  SN: 'Senegal',
  RS: 'Serbia',
  SC: 'Seychelles',
  SL: 'Sierra Leone',
  SG: 'Singapore',
  SK: 'Slovakia',
  SI: 'Slovenia',
  SB: 'Solomon Islands',
  SO: 'Somalia',
  ZA: 'South Africa',
  GS: 'South Georgia And Sandwich Isl.',
  ES: 'Spain',
  LK: 'Sri Lanka',
  SD: 'Sudan',
  SR: 'Suriname',
  SJ: 'Svalbard And Jan Mayen',
  SZ: 'Swaziland',
  SE: 'Sweden',
  CH: 'Switzerland',
  SY: 'Syrian Arab Republic',
  TW: 'Taiwan',
  TJ: 'Tajikistan',
  TZ: 'Tanzania',
  TH: 'Thailand',
  TL: 'Timor-Leste',
  TG: 'Togo',
  TK: 'Tokelau',
  TO: 'Tonga',
  TT: 'Trinidad And Tobago',
  TN: 'Tunisia',
  TR: 'Turkey',
  TM: 'Turkmenistan',
  TC: 'Turks And Caicos Islands',
  TV: 'Tuvalu',
  UG: 'Uganda',
  UA: 'Ukraine',
  AE: 'United Arab Emirates',
  GB: 'United Kingdom',
  US: 'United States',
  UM: 'United States Outlying Islands',
  UY: 'Uruguay',
  UZ: 'Uzbekistan',
  VU: 'Vanuatu',
  VE: 'Venezuela',
  VN: 'Vietnam',
  VG: 'Virgin Islands, British',
  VI: 'Virgin Islands, U.S.',
  WF: 'Wallis And Futuna',
  EH: 'Western Sahara',
  YE: 'Yemen',
  ZM: 'Zambia',
  ZW: 'Zimbabwe',
};
