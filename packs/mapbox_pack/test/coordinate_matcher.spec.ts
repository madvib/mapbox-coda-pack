import {expect} from 'chai';
import {coordinatePairMatcher} from '../src/shared/utility_functions';

describe('coordinate pair matcher', () => {
  it('matches valid lon/lat coordinate pair', () => {
    let match = coordinatePairMatcher.test('-73.9866,-40.7306');
    expect(match).equal(true);
  });
});
