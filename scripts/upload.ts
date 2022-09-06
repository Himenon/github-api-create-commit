import * as fs from "fs";
import * as GitHubApiCreateCommit from "../src";

const github = GitHubApiCreateCommit.create({
  owner: "Himenon",
  repo: "github-api-create-commit",
  accessToken: process.env.GITHUB_TOKEN,
});

const main = async () => {
  await github.createGitCommit({
    baseBranchName: "master",
    headBranchName: "demo",
    commitMessage: "feat: add markdown file",
    files: [
      {
        path: "hello-world.md",
        content: fs.readFileSync("sample/sample.txt", "utf-8"),
      },
      {
        encoding: "base64",
        path: "picture.jpeg",
        content: fs.readFileSync("sample/picture.jpeg", "base64"),
      },
    ],
  });
};

main().catch(error => {
  console.error(error);
  process.exit(1);
});
