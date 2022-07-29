import {ParamDefs, ParamValues} from '@codahq/packs-sdk';
import {executeFormulaFromPackDef} from '@codahq/packs-sdk/dist/development';
import {assert} from 'chai';
import {liveTest, pack} from '../../pack';

if (liveTest) {
  describe('Account Formulas', () => {
    const params = {
      expires: 60,
      scopes: ['styles:read'],
    };
    it('returns a temp token from the accounts api', async () => {
      const result = await executeFormulaFromPackDef(
        pack,
        'GenerateToken',
        Object.values(params) as ParamValues<ParamDefs>,
        undefined,
        undefined,
        {useRealFetcher: true, manifestPath: require.resolve('../../pack')}
      );
      console.log(result);
      let token: string = result;
      assert.isTrue(token.startsWith('tk'));
    });
  });
}
