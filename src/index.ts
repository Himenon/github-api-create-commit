import { GitHub } from "./GitHub";
import * as ApiClientImpl from "./ApiClientImpl";
import { createClient, type Client, Schemas } from "./api";
import { FetchFunction } from "./types";
import nodeFetch from "node-fetch";
export * from "./types";

export { Schemas, GitHub, type  Client };

export interface InitializeParameter {
  owner: string;
  repo: string;
  /**
   * For GitHUB API Endpoint
   * Default: https://api.github.com
   */
  baseUrl?: string | "https://api.github.com";
  /** GitHub Access Token */
  accessToken?: string;
  /**
   * Default: node-fetch
   */
  fetch?: FetchFunction;
}

export const create = (args: InitializeParameter): GitHub => {
  const baseUrl = args.baseUrl || "https://api.github.com";
  const _fetch: FetchFunction = args.fetch || nodeFetch;
  const apiClientImpl = ApiClientImpl.create({
    accessToken: args.accessToken,
    fetch: _fetch,
  });
  const client = createClient(apiClientImpl, baseUrl);
  const github = new GitHub(client, args.owner, args.repo);
  return github;
};

export default create;
