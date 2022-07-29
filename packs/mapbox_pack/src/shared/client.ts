import * as coda from '@codahq/packs-sdk';

import {Param} from './params/param';

export const baseUrl = 'https://api.mapbox.com/';

export class MapBoxClient {
  public constructor(
    private args: {
      context: coda.ExecutionContext;
      endpoint: string;
      headers?: {[header: string]: string};
      token?: string;
      pathParams?: string;
      queryParams?: Param<any>[];
      body?: {[key: string]: any} | Param<any>[];
      appendUsername?: boolean;
    }
  ) {
    this.username = args.appendUsername ? getUsername(args.context) : '';
    this.headers = args.headers;
    this.pathParams = args.pathParams ?? '';

    if (args.body && Array.isArray(args.body)) {
      for (let p of args.body) {
        if (p.key && p.meetsConditions()) this.bodyParams[p.key] = p.getValue();
      }
    } else this.bodyParams = args.body;

    if (args.queryParams)
      for (let p of args.queryParams) {
        if (p.key && p.meetsConditions())
          this.queryParams[p.key] = p.getValue();
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
  async put(cacheTtlSecs?: number): Promise<any> {
    let response = await this.fetch('PUT', cacheTtlSecs, this.body());
    return response.body;
  }
  async delete(cacheTtlSecs?: number): Promise<any> {
    let response = await this.fetch('DELETE', cacheTtlSecs);
    return response.body;
  }
  private async fetch(
    method: 'GET' | 'POST' | 'DELETE' | 'PUT',
    cacheTtlSecs?: number,
    body?: string | Buffer
  ): Promise<any> {
    console.log(this.url());
    let response: Promise<coda.FetchResponse<any>>;
    try {
      response = this.args.context.fetcher.fetch({
        headers: this.headers,
        method: method,
        url: this.url(),
        body: body,
        cacheTtlSecs: cacheTtlSecs,
      });
    } catch (error) {
      // If the request failed because of a non-200 status code.
      if (error.statusCode) {
        // Cast the error as a StatusCodeError, for better intellisense.
        let statusError = error as coda.StatusCodeError;
        // If the API returned an error message in the body, show it to the user.
        let message = statusError.body?.message;
        if (message) {
          throw new coda.UserVisibleError(message);
        }
      }
      // The request failed for some other reason. Re-throw the error so that it
      // bubbles up.
      throw error;
    }
    return response;
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
