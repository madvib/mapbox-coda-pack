import * as coda from '@codahq/packs-sdk';

export const coordinatePairMatcher = new RegExp(
  '^((\\-?([1-8])?\\d(\\.\\d{0,9})?)|(\\-?90(\\.0+)?))(,)((\\-?((1[0-7])|\\d)?\\d(\\.\\d{0,9})?)|(\\-?180(\\.0+)?))$',
  ''
);

export const validate = function (condition: boolean, format: string) {
  if (!condition) {
    var error: coda.UserVisibleError;
    if (format === undefined) {
      error = new coda.UserVisibleError('An exception occurred');
    } else {
      error = new coda.UserVisibleError(format);
      error.name = 'Invariant Violation';
    }

    throw error;
  }
};
