import {expect} from 'chai';
import {
  coordinatePairMatcher,
  hexColorMatcher,
} from '../src/shared/utility_functions';

describe('utility functions', () => {
  it('coordinate pair matcher identifies lon/lat coordinate pair', () => {
    let match = coordinatePairMatcher.test('-73.9866,-40.7306');
    expect(match).equal(true);
  });
  it('matches valid lon/lat coordinate pair', () => {
    let match6 = hexColorMatcher.test('9ed4bd');
    expect(match6).equal(true);
    let match3 = hexColorMatcher.test('f44');
    expect(match3).equal(true);
  });
});
