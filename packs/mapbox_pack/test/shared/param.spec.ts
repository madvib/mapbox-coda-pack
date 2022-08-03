import * as coda from '@codahq/packs-sdk';
import {Param} from '../../src/shared/params/param';
import {assert, expect} from 'chai';
import {TilesetParam} from '../../src/maps/parameters';

const TestParam = new Param<coda.ParameterType.String>({
  useKey: true,
  formatValue: (arg) => arg.toUpperCase(),
  rules: (arg) => [arg.length >= 2],
  codaDef: coda.makeParameter({
    type: coda.ParameterType.String,
    name: 'testParam',
    description: '',
    optional: true,
    suggestedValue: 'test',
  }),
});
const NoDefaultParam = new Param<coda.ParameterType.String>({
  codaDef: coda.makeParameter({
    type: coda.ParameterType.String,
    name: 'noDefault',
    description: '',
    optional: true,
  }),
});

describe('Param class', () => {
  it('key() return codaDef name if useKey = true', () => {
    expect(TestParam.key).equal('testParam');
  });
  it('codaDef suggestedValue is used by default', () => {
    expect(TestParam.getValue()).equal('TEST');
    expect(NoDefaultParam.getValue()).equal(undefined);
  });
  it('does not set value to when passed undefined from formula', () => {
    TestParam.setValue(undefined);
    expect(TestParam.getValue()).equal('TEST');
  });
  it('applies formatter when retrieving value', () => {
    TestParam.setValue('value');
    expect(TestParam.getValue()).equal('VALUE');
  });
  it('applies rules when meetsConditions is called and throws an error if a rule fails', () => {
    expect(TestParam.meetsConditions()).true;
    TestParam.setValue('1');
    assert.throws(TilesetParam.meetsConditions);
  });
});
