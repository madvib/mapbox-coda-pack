import * as coda from '@codahq/packs-sdk';
import dayjs = require('dayjs');
import {MapBoxClient} from '../shared/client';
import {Param} from '../shared/params/param';
import {populateParams} from '../shared/utility_functions';

const ExpiresParam = new Param<coda.ParameterType.Number>({
  useKey: true,
  rules: (minutes) => [minutes > 0, minutes <= 60],
  formatValue: (val) =>
    dayjs(new Date()).add(val, 'minute').toDate().toISOString(),
  codaDef: coda.makeParameter({
    name: 'expires',
    description:
      'Time in minutes until the temporary token will expire. Cannot be in the past or more than one hour in the future.',
    type: coda.ParameterType.Number,
    optional: true,
    suggestedValue: 60,
  }),
});
const ScopesParam = new Param<coda.ParameterType.StringArray>({
  useKey: true,
  rules: (scopes) => [
    scopes.every((s) =>
      [
        'styles:tiles',
        'styles:read',
        'fonts:read',
        'datasets:read',
        'vision:read',
      ].includes(s)
    ),
  ],
  codaDef: coda.makeParameter({
    optional: true,
    type: coda.ParameterType.StringArray,
    name: 'scopes',
    description:
      'Specify the scopes that the new temporary token will have. The authorizing token needs to have the same scopes as, or more scopes than, the new temporary token you are creating.',
    suggestedValue: ['styles:read'],
  }),
});

const GenTokenParams = [ExpiresParam, ScopesParam];

export const generateToken = coda.makeFormula({
  name: 'GenerateToken',
  resultType: coda.ValueType.String,
  description:
    'Create a temporary token, useful in other formulas with a client-exposed token such as Map() and StaticImage(). Secret token used to create a temp token must have [tokens: read, write] scopes enabled',
  cacheTtlSecs: 0,
  examples: [
    {
      params: [],
      result:
        'tk.eyJ1IjoibWFkdmliIiwiZXhwIjoxNjU3MTQ3NDg2LCJpYXQiOjE2NTcxNDU2ODcsInNjb3BlcyI6WyJzdHlsZXM6cmVhZCJdLCJjbGllbnQiOiJhcGkifQ.Cqh6k5LjT1RctLu3qxXEeg',
    },
    {
      params: [60, ['styles:read']],
      result:
        'tk.eyJ1IjoibWFkdmliIiwiZXhwIjoxNjU3MTQ3NDg2LCJpYXQiOjE2NTcxNDU2ODcsInNjb3BlcyI6WyJzdHlsZXM6cmVhZCJdLCJjbGllbnQiOiJhcGkifQ.Cqh6k5LjT1RctLu3qxXEeg',
    },
  ],
  parameters: GenTokenParams.map((p) => p.codaDef) as coda.ParamDefs,
  execute: async function (params, context) {
    populateParams(params, GenTokenParams);

    let client = new MapBoxClient({
      context,
      headers: {'Content-Type': 'application/json'},
      endpoint: 'tokens/v2/',
      appendUsername: true,
      body: GenTokenParams,
    });

    let response = await client.post(0);

    let token = response.token;

    return token;
  },
});
