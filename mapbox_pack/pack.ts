import * as coda from '@codahq/packs-sdk';
import {generateToken} from './src/account/temporaryToken';
import {
  datasetSyncTable,
  featuresDynamicSyncTable,
} from './src/maps/formulas/data';
import {htmlEmbed} from './src/maps/formulas/embed_html';
import {staticImage} from './src/maps/formulas/static_images';
import {stylesSyncTable} from './src/maps/formulas/styles';
import Isochrone from './src/navigation/formulas/isochrone';
import Search, {
  CountryCodesFormula,
  PlaceTypes,
} from './src/search/formulas/geocode';

export const pack = coda.newPack();
pack.formulas.push(
  Search,
  htmlEmbed,
  staticImage,
  Isochrone,
  generateToken,
  PlaceTypes,
  CountryCodesFormula
);
pack.syncTables.push(
  stylesSyncTable,
  datasetSyncTable,
  featuresDynamicSyncTable
);

pack.setUserAuthentication({
  type: coda.AuthenticationType.Custom,
  params: [
    {
      name: 'access_token',
      description: 'access_token',
    },
    {
      name: 'username',
      description: 'username',
    },
  ],
});

pack.addNetworkDomain('mapbox.com');
