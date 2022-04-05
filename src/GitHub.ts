import type { Client, Schemas } from "./api";
import type * as Types from "./types";

export class GitHub {
  constructor(private readonly client: Client<Types.RequestOption>, private readonly owner: string, private readonly repo: string) {}
  /**
   * * `headBranchName`に対してコミットする
   * * もし、`headBranchName`が存在しない場合は、`baseBranchName`からチェックアウトしたブランチに対してコミットする
   * * `baseBranchName`が指定されていない場合はリポジトリの`defaultBranch`からチェックアウトしたブランチに対してコミットする
   */
  public createGitCommit = async ({
    baseBranchName,
    headBranchName,
    commitMessage,
    files,
  }: Types.CreateGitCommitArgs): Promise<Schemas.commit> => {
    const owner = this.owner;
    const repo = this.repo;
    const ref = `heads/${headBranchName}`;
    const parentCommit = await this.getParentCommit({ headBranchName, baseBranchName });

    const newTreeTasks = files.map(async file => {
      const shortBlob = await this.client.git$create$blob({
        parameter: {
          owner,
          repo,
        },
        requestBody: {
          content: file.content,
          encoding: "utf-8",
        },
      });
      return {
        path: file.path,
        mode: "100644" as const,
        type: "blob" as const,
        sha: shortBlob.sha,
      };
    });

    const newTree = await Promise.all(newTreeTasks);

    const newGitTree = await this.client.git$create$tree({
      parameter: {
        owner,
        repo,
      },
      requestBody: {
        base_tree: parentCommit.sha, // 親のcommit sha
        tree: newTree,
      },
    });

    const newCommit = await this.client.git$create$commit({
      parameter: {
        owner,
        repo,
      },
      requestBody: {
        message: commitMessage,
        tree: newGitTree.sha,
        parents: [parentCommit.sha],
      },
    });

    await this.client.git$update$ref({
      parameter: {
        owner,
        repo,
        ref: ref,
      },
      requestBody: {
        sha: newCommit.sha,
      },
    });

    return await this.client.repos$get$commit({
      parameter: {
        owner,
        repo,
        ref: newCommit.sha,
      },
    });
  };

  private createBranch = async ({ branchName, baseBranchName }: Types.CreateBranchArgs): Promise<void> => {
    const owner = this.owner;
    const repo = this.repo;
    let baseRef: string;
    if (baseBranchName) {
      baseRef = `heads/${baseBranchName}`;
    } else {
      const repos = await this.client.repos$get({
        parameter: {
          owner,
          repo,
        },
      });
      baseRef = `heads/${repos.default_branch}`;
    }
    const defaultBranchGitRef = await this.client.git$get$ref({
      parameter: {
        owner,
        repo,
        ref: baseRef,
      },
    });
    const defaultBranchParentCommit = await this.client.repos$get$commit({
      parameter: {
        owner,
        repo,
        ref: defaultBranchGitRef.ref,
      },
    });
    await this.client.git$create$ref({
      parameter: {
        owner,
        repo,
      },
      requestBody: {
        ref: `refs/heads/${branchName}`,
        sha: defaultBranchParentCommit.sha,
      },
    });
  };
  /**
   * 親のコミットを取得する
   * ref(ブランチ)が存在しない場合はでデフォルトブランチから作成して返す
   */
  private getParentCommit = async ({ headBranchName, baseBranchName }: Types.GetParentCommitArgs): Promise<Schemas.commit> => {
    const owner = this.owner;
    const repo = this.repo;
    const branches = await this.client.repos$list$branches({
      parameter: {
        owner,
        repo,
        per_page: 100,
        page: 1,
      },
    });
    // ブランチが存在しない場合は作成する
    if (!branches.find(b => b.name === headBranchName)) {
      const targetBaseBranchName = baseBranchName && !!branches.find(b => b.name === baseBranchName) ? baseBranchName : undefined;
      await this.createBranch({ branchName: headBranchName, baseBranchName: targetBaseBranchName });
    }
    const parentGitRef = await this.client.git$get$ref({
      parameter: {
        owner,
        repo,
        ref: `heads/${headBranchName}`,
      },
    });
    return await this.client.repos$get$commit({
      parameter: {
        owner,
        repo,
        ref: parentGitRef.ref,
      },
    });
  };
}
