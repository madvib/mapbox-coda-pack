import * as coda from '@codahq/packs-sdk';
import {Param} from './params/param';

export const coordinatePairMatcher = new RegExp(
  '^((\\-?([1-8])?\\d(\\.\\d{0,9})?)|(\\-?90(\\.0+)?))(,)((\\-?((1[0-7])|\\d)?\\d(\\.\\d{0,9})?)|(\\-?180(\\.0+)?))$',
  ''
);

export const hexColorMatcher = /([a-fA-F0-9]{6}|[a-fA-F0-9]{3})/;

export const rmSpacesLineBreaks = /[\s\n\r]+/g;

export const populateParams = function (
  inputs: any[],
  params: Param<any>[]
): void {
  for (let val of inputs) {
    params[inputs.indexOf(val)].setValue(val);
  }
};

export const validate = function (condition: boolean, format: string) {
  if (!condition) {
    var error: coda.UserVisibleError;
    if (format === undefined) {
      error = new coda.UserVisibleError('An exception occurred');
    } else {
      error = new coda.UserVisibleError(format);
      error.name = 'Invalid Parameter';
    }

    throw error;
  }
};
