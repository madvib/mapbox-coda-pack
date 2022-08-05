import {ParamDefs, ParamValues, SyncExecutionContext} from '@codahq/packs-sdk';
import {
  executeFormulaFromPackDef,
  executeSyncFormulaFromPackDef,
  newRealFetcherSyncExecutionContext,
} from '@codahq/packs-sdk/dist/development';
import {assert} from 'chai';
import {liveTest, pack} from '../../pack';

if (liveTest) {
  describe('Features', () => {
    let ctx: SyncExecutionContext = newRealFetcherSyncExecutionContext(
      pack,
      require.resolve('../../pack')
    );

    ctx.sync.dynamicUrl = 'cl3gejjil19xa21oxpjfscr96';
    it('sync table returns a valid schema', async () => {
      const result = await executeSyncFormulaFromPackDef(
        pack,
        'Features',
        [],
        ctx,
        undefined,
        {useRealFetcher: true, manifestPath: require.resolve('../../pack')}
      );
      console.log(result);
      assert.isTrue(Array.isArray(result));
    });
    it('adds a new feature', async () => {
      const params = {
        datasetId: 'cl3gejjil19xa21oxpjfscr96',
        featureId: 'test123',
        feature: JSON.stringify({
          geometry: {
            coordinates: [-76.49104648891985, 38.97886653092155],
            type: 'Point',
          },
          type: 'Feature',
          properties: {},
        }),
      };
      const result = await executeFormulaFromPackDef(
        pack,
        'AddFeature',
        Object.values(params) as ParamValues<ParamDefs>,
        undefined,
        undefined,
        {useRealFetcher: true, manifestPath: require.resolve('../../pack')}
      );
      assert.equal(result, 'OK');
    });
    it('deletes a feature', async () => {
      const params = {
        datasetId: 'cl3gejjil19xa21oxpjfscr96',
        featureId: 'test123',
      };
      const result = await executeFormulaFromPackDef(
        pack,
        'DeleteFeature',
        Object.values(params) as ParamValues<ParamDefs>,
        undefined,
        undefined,
        {useRealFetcher: true, manifestPath: require.resolve('../../pack')}
      );

      assert.equal(result, 'OK');
    });
  });
}
