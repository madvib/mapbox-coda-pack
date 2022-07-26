import {expect} from 'chai';
import {coordinatePairMatcher} from '../src/shared/utility_functions';

describe('coordinate pair matcher', () => {
  it('works', () => {
    let match = coordinatePairMatcher.test('-73.9866,-40.7306');
    expect(match).equal(true);
  });
  it('work', () => {
    const regex =
      /^((\-?([1-8])?\d(\.\d{0,9})?)|(\-?90(\.0+)?))(,)((\-?((1[0-7])|\d)?\d(\.\d{0,9})?)|(\-?180(\.0+)?))$/;
    let match = regex.test('73.9866,-40.7306');
    expect(match).equal(true);
  });
});
