import type { ApiClient, QueryParameters } from "./api";
import type * as Types from "./types";
import * as Formatter from "@himenon/openapi-parameter-formatter";

export const generateQueryString = (queryParameters: QueryParameters | undefined): string | undefined => {
  if (!queryParameters) {
    return undefined;
  }
  const queries = Object.entries(queryParameters).reduce<string[]>((queryStringList, [key, item]) => {
    if (!item.value) {
      return queryStringList;
    }
    if (!item.style) {
      return queryStringList.concat(`${key}=${item.value}`);
    }
    const result = Formatter.QueryParameter.generate(key, item as Formatter.QueryParameter.Parameter);
    if (result) {
      return queryStringList.concat(result);
    }
    return queryStringList;
  }, []);

  return queries.join("&");
};

export interface Params {
  accessToken?: string;
  fetch: Types.FetchFunction;
}

export const create = (params: Params): ApiClient<Types.RequestOption> => {
  const { accessToken, fetch: _fetch } = params;
  const apiClientImpl: ApiClient<Types.RequestOption> = {
    request: async (httpMethod, url, headers, requestBody, queryParameters): Promise<any> => {
      const query = generateQueryString(queryParameters);
      const requestUrl = query ? url + "?" + encodeURI(query) : url;
      const requestHeaders = {
        ...headers,
        Authorization: "token " + accessToken,
      };
      const response = await _fetch(requestUrl, {
        body: JSON.stringify(requestBody),
        headers: requestHeaders,
        method: httpMethod,
      });
      return await response.json();
    },
  };
  return apiClientImpl;
};
