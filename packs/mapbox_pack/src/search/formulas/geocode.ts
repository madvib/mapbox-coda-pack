import * as coda from '@codahq/packs-sdk';
import {GeocodingResponseSchema} from '../schema';
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
  ReverseModeParam,
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

export async function geocode(params: any[], context: coda.ExecutionContext) {
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

export async function autocompleteGeocode(
  context: coda.ExecutionContext,
  search: string
) {
  console.log(search);
  let results = await geocode(
    [search, true, undefined, undefined, undefined, undefined, undefined, 'ip'],
    context
  );

  let features: {center: any; place_name: string}[] = results.features;
  features.map((o) => (o['center'] = o.center.join()));

  return coda.autocompleteSearchObjects(
    search,
    features,
    'place_name',
    'center'
  );
}
