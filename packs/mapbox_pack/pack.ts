import * as coda from '@codahq/packs-sdk';
import {generateToken} from './src/account/temporaryToken';
import {datasetSyncTable} from './src/maps/formulas/data';
import {htmlEmbed} from './src/maps/formulas/embedHtml';
import {
  addFeature,
  deleteFeature,
  featuresDynamicSyncTable,
} from './src/maps/formulas/features';
import {markerOverlay, pathOverlay} from './src/maps/formulas/overlays';
import {staticImage} from './src/maps/formulas/staticImage';
import {stylesSyncTable} from './src/maps/formulas/styles';
import {tilequery} from './src/maps/formulas/tilequery';
import {tilesetSyncTable} from './src/maps/formulas/tilesets';
import directions from './src/navigation/formulas/directions';
import isochrone from './src/navigation/formulas/isochrone';
import geocode from './src/search/formulas/geocode';
import {getOptions} from './src/shared/formulas/getOptionsFormula';
import {encodePolyline} from './src/shared/formulas/polylineEncoder';

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
  pathOverlay,
  markerOverlay,
  encodePolyline,
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
      name: 'accessToken',
      description:
        'Mapbox access token, recommended to create a specific token for Coda with the following scopes: Styles: [read, write, list], Datasets: [read, list, write], Tokens: [read, write], Tilesets:[list]',
    },
    {
      name: 'username',
      description: 'Mapbox account username',
    },
  ],
});
