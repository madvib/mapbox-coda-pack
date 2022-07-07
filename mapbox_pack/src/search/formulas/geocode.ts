import * as coda from '@codahq/packs-sdk';
import {FeaturesSchema, GeocodingResponseSchema} from '../schema';
import {
  SearchTextParam,
  AutocompleteParam,
  BboxGeoParam,
  CountryParam,
  FuzzyMatchParam,
  LanguageParam,
  LimitParam,
  ProximityParam,
  RoutingParam,
  TypesParam,
  WorldviewParam,
  MapboxPlaceTypes,
  ReverseModeParam,
  CountryCodes,
  GeoParam,
} from '../parameters';
import {coordinatePairMatcher} from '../../shared/utility_functions';
import {MapBoxClient} from '../../shared/client';

const geocodeParams: GeoParam<any, any>[] = [
  SearchTextParam,
  AutocompleteParam,
  BboxGeoParam,
  CountryParam,
  FuzzyMatchParam,
  LanguageParam,
  LimitParam,
  ProximityParam,
  RoutingParam,
  TypesParam,
  WorldviewParam,
  ReverseModeParam,
];

export const PlaceTypes = coda.makeFormula({
  name: 'PlaceTypeEnum',
  description: 'Returns possible type values for queries to the geocoder api',
  resultType: coda.ValueType.Array,
  items: {type: coda.ValueType.String},
  parameters: [],
  execute: async () => MapboxPlaceTypes,
});

export const CountryCodesFormula = coda.makeFormula({
  name: 'CountryCodeEnum',
  description:
    'Returns possible country values for queries to the geocoder api',
  resultType: coda.ValueType.Array,
  items: {type: coda.ValueType.String},
  parameters: [],
  execute: async () => Object.keys(CountryCodes),
});

export default coda.makeFormula({
  resultType: coda.ValueType.Object,
  schema: GeocodingResponseSchema,
  name: 'Search',
  description:
    'Forward or reverse geocode entering either a search query or longitude,latitude pair',
  // TODO  examples:
  parameters: geocodeParams.map((p) => p.codaDef) as coda.ParamDefs,
  execute: geocode,
});

async function geocode(params: any[], context: coda.ExecutionContext) {
  console.log(params);
  // populate values in Param objects
  for (let p of params) {
    geocodeParams[params.indexOf(p)].setValue(p);
  }

  let coordinateQuery = coordinatePairMatcher.test(SearchTextParam.getValue());

  const client = new MapBoxClient({
    context,
    endpoint: 'geocoding/v5/',
    pathParams: `mapbox.places/${SearchTextParam.getValue()}.json?`,
    queryParams: geocodeParams.filter(
      (p) => p.key && (coordinateQuery ? p.reverseGeocode : p.forwardGeocode)
    ),
  });

  return client.get();
}

// async function geocode(
//   [
//     search_text,
//     autocomplete,
//     bbox,
//     country,
//     fuzzyMatch,
//     language,
//     limit,
//     proximity,
//     routing,
//     types,
//     worldview,
//     reverseMode,
//   ],
//   context: coda.ExecutionContext
// ) {
//   let matcher = new RegExp(
//     '^[-+]?([1-8]?d(.d+)?|90(.0+)?),s*[-+]?(180(.0+)?|((1[0-7]d)|([1-9]?d))(.d+)?)$'
//   );
//   let coordinateQuery = matcher.test(search_text);

//   let query = SearchTextParam.validate(search_text)
//     ? search_text.substring(0, 256)
//     : '';

//   const client = new MapBoxClient({
//     context,
//     endpoint: 'geocoding/v5/',
//     pathParams: `mapbox.places/${query}.json?`,
//   });

//   const queryParams: {
//     [key: string]: any;
//   } = {
//     access_token: getToken(context),
//   };

//   if (AutocompleteParam.validate(autocomplete) && !coordinateQuery)
//     queryParams.autocomplete = autocomplete;

//   if (BboxParam.validate(bbox) && !coordinateQuery)
//     queryParams.bbox = bbox.join();

//   if (CountryParam.validate(country)) queryParams.country = country.join();

//   if (FuzzyMatchParam.validate(fuzzyMatch) && !coordinateQuery)
//     queryParams.fuzzyMatch = fuzzyMatch;

//   if (LanguageParam.validate(language)) queryParams.language = language.join();

//   if (LimitParam.validate(limit)) queryParams.limit = Math.trunc(limit);

//   if (ProximityParam.validate(proximity) && !coordinateQuery)
//     queryParams.proximity = proximity;

//   if (RoutingParam.validate(routing)) queryParams.routing = routing;

//   if (TypesParam.validate(types)) queryParams.types = types.join();

//   if (WorldviewParam.validate(worldview)) queryParams.worldview = worldview;

//   if (ReverseModeParam.validate(reverseMode) && coordinateQuery)
//     queryParams.reverseMode = reverseMode;

//   let url = coda.withQueryParams(
//     `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?`,
//     queryParams
//   );

//   let response = await context.fetcher.fetch({
//     method: 'GET',
//     url: url,
//   });
//   return response.body;
// }
