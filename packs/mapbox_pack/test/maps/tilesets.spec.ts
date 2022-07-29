import {executeSyncFormulaFromPackDef} from '@codahq/packs-sdk/dist/development';
import {assert} from 'chai';
import {liveTest, pack} from '../../pack';

if (liveTest) {
  describe('Tilesets', () => {
    it('Schema is valid', async () => {
      const result = await executeSyncFormulaFromPackDef(
        pack,
        'Tilesets',
        [],
        undefined,
        undefined,
        {useRealFetcher: true, manifestPath: require.resolve('../../pack')}
      );
      console.log(result);
      assert.isTrue(Array.isArray(result));
    });
  });
}
