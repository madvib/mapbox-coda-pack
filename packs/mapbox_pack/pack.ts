import * as coda from '@codahq/packs-sdk';
import {generateToken} from './src/account/temporaryToken';
import {datasetSyncTable} from './src/maps/formulas/data';
import {htmlEmbed} from './src/maps/formulas/embed_html';
import {
  addFeature,
  deleteFeature,
  featuresDynamicSyncTable,
} from './src/maps/formulas/features';
import {staticImage} from './src/maps/formulas/static_image';
import {stylesSyncTable} from './src/maps/formulas/styles';
import {tilequery} from './src/maps/formulas/tilequery';
import {tilesetSyncTable} from './src/maps/formulas/tilesets';
import directions from './src/navigation/formulas/directions';
import isochrone from './src/navigation/formulas/isochrone';
import geocode from './src/search/formulas/geocode';
import {getOptions} from './src/shared/params/getOptionsFormula';

export const liveTest: boolean = false;
export const pack = coda.newPack();

pack.syncTables.push(
  stylesSyncTable,
  tilesetSyncTable,
  datasetSyncTable,
  featuresDynamicSyncTable
);

pack.formulas.push(
  geocode,
  htmlEmbed,
  staticImage,
  tilequery,
  directions,
  isochrone,
  addFeature,
  deleteFeature,
  generateToken,
  getOptions
);

pack.addNetworkDomain('mapbox.com');
pack.setUserAuthentication({
  type: coda.AuthenticationType.Custom,
  params: [
    {
      name: 'access_token',
      description:
        'Mapbox access token, recommended to create a specific token for Coda with the following scopes: Styles: [read, write, list], Datasets: [read, list, write], Tokens: [read, write]',
    },
    {
      name: 'username',
      description: 'Mapbox account username',
    },
  ],
});
