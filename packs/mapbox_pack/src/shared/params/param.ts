import * as coda from '@codahq/packs-sdk';
import {ParameterTypeMap} from '@codahq/packs-sdk/dist/api_types';
import {validate} from '../utility_functions';

type Validator<T> = (arg: T | undefined) => boolean[];
type Formatter<T> = (arg: T) => any;
type Primitive<C extends coda.ParameterType> = coda.SuggestedValueType<
  ParameterTypeMap[C]
>;

export interface ParamOptions<C extends coda.ParameterType> {
  useKey?: boolean | string;
  rules?: Validator<Primitive<C>>;
  formatValue?: Formatter<Primitive<C>>;
  codaDef: coda.ParamDef<ParameterTypeMap[C]>;
}

export class Param<C extends coda.ParameterType> {
  readonly key?: string;
  private _value?: Primitive<C>;
  private isRequired: boolean;
  private rules?: Validator<Primitive<C>>;
  private format?: Formatter<Primitive<C>>;
  readonly codaDef: coda.ParamDef<ParameterTypeMap[C]>;

  constructor(options: ParamOptions<C>) {
    this.codaDef = options.codaDef;
    this.rules = options.rules;
    this.format = options.formatValue;
    this.key =
      // if a string key is supplied then it overrides the Coda Def name
      typeof options.useKey === 'string'
        ? options.useKey
        : options.useKey
        ? this.codaDef.name
        : undefined;
    this._value = options.codaDef.suggestedValue;
    this.isRequired = !options.codaDef.optional;
  }

  public meetsConditions(): boolean {
    // console.log(this.codaDef.name + ': ' + this._value);
    let hasValue = this._value != null;

    // parameter should not be included in query if left undefined, but does not need to throw an error since it is not required
    if (!this.isRequired && !hasValue) return false;

    // if paramater is required it cannot be null or undefined, optionally apply validation rules
    let conditions = this.rules
      ? hasValue && this.rules(this._value).every((r) => r)
      : hasValue;

    // throw user visible error if provided value is invalid
    validate(
      conditions,
      `Entered ${this._value}...${this.codaDef.description}`
    );

    return conditions;
  }

  public setValue(arg: Primitive<C>): void {
    if (arg != null) this._value = arg;
  }
  public getValue = (): Primitive<C> =>
    this.format && this._value != null ? this.format(this._value) : this._value;
}

export const BboxParamOptions: ParamOptions<coda.ParameterType.NumberArray> = {
  formatValue: (arg) => arg.join(),
  rules: (bbox) => [
    bbox && Array.isArray(bbox),
    bbox.length === 4,
    typeof bbox[0] === 'number',
    typeof bbox[1] === 'number',
    typeof bbox[2] === 'number',
    typeof bbox[3] === 'number',
  ],
  codaDef: coda.makeParameter({
    type: coda.ParameterType.NumberArray,
    name: 'bbox',
    description:
      'Limit results to only those contained within the supplied bounding box. Bounding boxes should be supplied as four numbers separated by commas, in minLon,minLat,maxLon,maxLat order. The bounding box cannot cross the 180th meridian.',
    optional: true,
  }),
};
export const LonParam = new Param<coda.ParameterType.Number>({
  useKey: undefined,
  rules: (val) => [typeof val === 'number', val >= -180, val <= 180],
  codaDef: coda.makeParameter({
    type: coda.ParameterType.Number,
    name: 'longitude',
    description:
      'Longitude for the center point of the static map; a number between -180 and 180.',
    optional: true,
    suggestedValue: 119.78412975676417,
  }),
});

export const LatParam = new Param<coda.ParameterType.Number>({
  useKey: undefined,
  rules: (val) => [typeof val === 'number', val >= -85.0511, val <= 85.0511],
  codaDef: coda.makeParameter({
    type: coda.ParameterType.Number,
    name: 'latitude',
    description:
      'Latitude for the center point of the static map; a number between -85.0511 and 85.0511.',
    suggestedValue: 36.74022546184459,
    optional: true,
  }),
});
