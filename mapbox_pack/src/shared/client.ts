import * as coda from '@codahq/packs-sdk';

import {Param} from './param';

export const baseUrl = 'https://api.mapbox.com/';

export class MapBoxClient {
  public constructor(
    private args: {
      context: coda.ExecutionContext;
      endpoint: string;
      headers?: {[header: string]: string};
      token?: string;
      pathParams?: string;
      queryParams?: Param<any, any>[];
      body?: Param<any, any>[];
      appendUsername?: boolean;
    }
  ) {
    this.username = args.appendUsername ? getUsername(args.context) : '';
    this.headers = args.headers;
    this.pathParams = args.pathParams ?? '';

    if (args.body)
      for (let p of args.body) {
        if (p.key && p.include()) this.bodyParams[p.key] = p.getValue();
      }

    if (args.queryParams)
      for (let p of args.queryParams) {
        if (p.key && p.include()) this.queryParams[p.key] = p.getValue();
      }
  }

  private username: string;
  private headers: {[header: string]: string};
  private bodyParams: {[key: string]: any} = {};
  private pathParams: string;
  private queryParams: {
    [key: string]: any;
  } = {};

  private url(): string {
    return coda.withQueryParams(
      baseUrl + this.args.endpoint + this.username + this.pathParams,
      {
        ...this.queryParams,
        access_token: this.args.token ?? getToken(this.args.context),
      }
    );
  }
  private body(): string {
    return JSON.stringify(this.bodyParams);
  }
  async get(cacheTtlSecs?: number): Promise<any> {
    let response = await this.fetch('GET', cacheTtlSecs);
    return response.body;
  }

  async post(cacheTtlSecs?: number): Promise<any> {
    let response = await this.fetch('POST', cacheTtlSecs, this.body());
    return response.body;
  }

  private async fetch(
    method: 'GET' | 'POST',
    cacheTtlSecs?: number,
    body?: string | Buffer
  ): Promise<any> {
    return this.args.context.fetcher.fetch({
      headers: this.headers,
      method: method,
      url: this.url(),
      body: body,
      cacheTtlSecs: cacheTtlSecs,
    });
  }
}

export const getToken = function (context: coda.ExecutionContext) {
  let invocationToken = context.invocationToken;
  let tokenPlaceholder = '{{access_token-' + invocationToken + '}}';
  return tokenPlaceholder;
};

export const getUsername = function (context: coda.ExecutionContext) {
  let invocationToken = context.invocationToken;
  let tokenPlaceholder = '{{username-' + invocationToken + '}}';

  return tokenPlaceholder;
};
