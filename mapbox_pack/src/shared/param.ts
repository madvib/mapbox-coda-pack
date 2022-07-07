import * as coda from '@codahq/packs-sdk';
import {UnionType} from '@codahq/packs-sdk/dist/api_types';

type Validator<T> = (arg: T | undefined) => boolean[];
type Formatter<T> = (arg: T) => any;
export interface ParamOptions<T, C extends UnionType> {
  key: string | undefined;
  default?: T;
  required?: boolean;
  rules?: Validator<T>;
  formatValue?: Formatter<T>;
  codaDef: coda.ParamDef<C>;
  possibleValues?: T[];
}

export class Param<T, C extends UnionType> {
  readonly key?: string;
  private _value?: T;
  private isRequired: boolean;
  private rules?: Validator<T>;
  // TODO should there be 3rd type param in cases format output differs from input?
  private format?: Formatter<T>;
  readonly codaDef: coda.ParamDef<C>;
  public possibleValues?: T[];

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
    this.format && this._value ? this.format(this._value) : this._value;
}

const validate = function (condition: boolean, format: string) {
  if (!condition) {
    var error: coda.UserVisibleError;
    if (format === undefined) {
      error = new coda.UserVisibleError('An exception occurred');
    } else {
      error = new coda.UserVisibleError(format);
      error.name = 'Invariant Violation';
    }

    throw error;
  }
};

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
