import * as coda from '@codahq/packs-sdk';
import {UnionType} from '@codahq/packs-sdk/dist/api_types';
import {autocompleteGeocode} from '../../search/formulas/geocode';
import {validate} from '../utility_functions';

type Validator<T> = (arg: T | undefined) => boolean[];
type Formatter<T> = (arg: T) => any;
export interface ParamOptions<T, C extends UnionType> {
  key: string | undefined;
  default?: T;
  required?: boolean;
  rules?: Validator<T>;
  formatValue?: Formatter<T>;
  codaDef: coda.ParamDef<C>;
}

export class Param<T, C extends UnionType> {
  readonly key?: string;
  private _value?: T;
  private isRequired: boolean;
  private rules?: Validator<T>;
  // TODO should there be 3rd type param in cases format output differs from input?
  private format?: Formatter<T>;
  readonly codaDef: coda.ParamDef<C>;

  constructor(options: ParamOptions<T, C>) {
    this.codaDef = options.codaDef;
    this.rules = options.rules;
    this.format = options.formatValue;
    this.key = options.key;
    this._value = options.default;
    this.isRequired = !options.codaDef.optional;
  }

  public include(): boolean {
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

  public setValue(arg: T): void {
    if (arg != null) this._value = arg;
  }
  public getValue = (): T =>
    this.format && this._value != null ? this.format(this._value) : this._value;
}

export const BboxParamOptions: ParamOptions<
  number[],
  coda.ArrayType<coda.Type.number>
> = {
  key: 'bbox',
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
    name: 'boundingBox',
    description:
      'Limit results to only those contained within the supplied bounding box. Bounding boxes should be supplied as four numbers separated by commas, in minLon,minLat,maxLon,maxLat order. The bounding box cannot cross the 180th meridian.',
    optional: true,
  }),
};
export const LonParam = new Param<number, coda.Type.number>({
  key: undefined,
  default: -122.3492,
  rules: (val) => [typeof val === 'number', val >= -180, val <= 180],
  codaDef: coda.makeParameter({
    type: coda.ParameterType.Number,
    name: 'longitude',
    description:
      'Longitude for the center point of the static map; a number between -180 and 180.',
    optional: true,
  }),
});

export const LatParam = new Param<number, coda.Type.number>({
  key: undefined,
  default: 37.8174,
  rules: (val) => [typeof val === 'number', val >= -85.0511, val <= 85.0511],
  codaDef: coda.makeParameter({
    type: coda.ParameterType.Number,
    name: 'latitude',
    description:
      'Latitude for the center point of the static map; a number between -85.0511 and 85.0511.',
    optional: true,
  }),
});
