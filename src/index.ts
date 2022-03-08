import { GitHub } from "./GitHub";
import * as ApiClientImpl from "./ApiClientImpl";
import { Client, Schemas } from "./api";
export * from "./types";

export { Schemas };

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
}

export const create = (args: InitializeParameter): GitHub => {
  const baseUrl = args.baseUrl || "https://api.github.com";
  const apiClientImpl = ApiClientImpl.create(args.accessToken);
  const client = new Client(apiClientImpl, baseUrl);
  const github = new GitHub(client, args.owner, args.repo);
  return github;
};
