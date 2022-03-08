export interface RequestOption {}

export interface CreateBranchArgs {
  branchName: string;
  baseBranchName?: string;
}

export interface GetParentCommit {
  headBranchName: string;
  baseBranchName?: string;
}

export interface CreateGitCommit {
  baseBranchName?: string;
  headBranchName: string;
  files: {
    path: string;
    content: string;
  }[];
  commit: {
    message: string;
  };
}

export interface CreateCommitRequestSuccessResponse {
  commit: {
    htmlUrl: string;
    message: string;
    sha: string;
  };
}
