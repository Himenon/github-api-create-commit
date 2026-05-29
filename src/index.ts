import nodeFetch from "node-fetch";
import * as ApiClientImpl from "./ApiClientImpl";
import { type Client, createClient, Schemas } from "./api";
import { GitHub } from "./GitHub";
import type { FetchFunction } from "./types";

export * from "./types";

export { type Client, GitHub, Schemas };

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
