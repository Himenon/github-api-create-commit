# @himenon/github-api-create-commit

Create a Commit to GitHub via WebAPI.

## Install

```bash
yarn add @himenon/github-api-create-commit

pnpm add @himenon/github-api-create-commit
```

## Usage

```ts
import * as GitHubApiCreateCommit from "@himenon/github-api-create-commit";

const github = GitHubApiCreateCommit.create({
  owner: "Himenon",
  repo: "github-api-create-commit",
  accessToken: "",
});

await github.createGitCommit({
  baseBranchName: "master",
  headBranchName: "develop",
  commitMessage: "feat: add markdown file",
  files: [
    {
      path: "hello-world.md",
      content: "# Hello world",
    },
  ],
});
```

**Shell scripts with the same meaning**

```bash
git checkout -b develop origin/master
echo "# Hello world" > hello-world.md
git add hello-world.md
git commit -m "feat: add markdown file"
git push develop
```

## LICENCE

[@Himenon/github-api-create-commit](https://github.com/Himenon/github-api-create-commit)・MIT
