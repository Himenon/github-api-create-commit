import type { RequestInfo, RequestInit, Response } from "node-fetch";

export interface RequestOption {}

export type FetchFunction = (url: RequestInfo, init?: RequestInit) => Promise<Response>;

export interface CreateBranchArgs {
  branchName: string;
  baseBranchName?: string;
}

export interface GetParentCommitArgs {
  headBranchName: string;
  baseBranchName?: string;
}

export interface CommitFile {
  /**
   * File path from repository root.
   */
  path: string;
  /**
   * Blob Content in utf-8 format.
   */
  content: string;
}

export interface CreateGitCommitArgs {
  /**
   * Name of the branch from which the commit is to be made. If not specified, the default branch specified by the repository.
   */
  baseBranchName?: string;
  /**
   * If the specified branch name does not exist, a new branch is created and a commit is performed.
   */
  headBranchName: string;
  /**
   * Files to be committed. Need more than one.
   */
  files: CommitFile[];
  commitMessage: string;
}
