import {ParamDefs, ParamValues} from '@codahq/packs-sdk';
import {UnionType} from '@codahq/packs-sdk/dist/api_types';
import {MockExecutionContext} from '@codahq/packs-sdk/dist/development';
import {executeFormulaFromPackDef} from '@codahq/packs-sdk/dist/development';
import {newMockExecutionContext} from '@codahq/packs-sdk/dist/development';
import {assert} from 'chai';
import {liveTest, pack} from '../../pack';

if (liveTest) {
  describe('Search formula', () => {
    let context: MockExecutionContext;

    beforeEach(() => {
      context = newMockExecutionContext();
    });
    const params = {
      search: 'point of interest',
      autocomplete: false,
      bbox: undefined,
      country: ['US'],
      fuzzyMatch: true,
      language: undefined,
      limit: 5,
      proximity: 'ip',
      routing: false,
      types: ['poi', 'place'],
      worldview: undefined,
      reverseMode: undefined,
    };

    it('forward geocodes', async () => {
      const result = await executeFormulaFromPackDef(
        pack,
        'Search',
        Object.values(params) as ParamValues<ParamDefs>,
        undefined,
        undefined,
        {useRealFetcher: true, manifestPath: require.resolve('../../pack')}
      );
      let features: any[] = result.Features;
      assert.equal(features.length, 5);
    });
    it('reverse geocodes', async () => {
      let revParams = {
        ...params,
        search: '-76.4910463857013,38.97884957200043',
        language: ['en'],
        limit: 1,
      };

      const result = await executeFormulaFromPackDef(
        pack,
        'Search',
        Object.values(revParams) as ParamValues<ParamDefs>,
        undefined,
        {validateResult: false},
        {useRealFetcher: true, manifestPath: require.resolve('../../pack')}
      );
      let features: any[] = result.Features;
      assert.isTrue(features.length > 0);
    });
  });
}
