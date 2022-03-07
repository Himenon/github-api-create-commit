import "./clean";
import { shell } from "./tools/shell";
import { generateExportsField } from "./tools/dualPackageSupport";
import * as fs from "fs";
import { EOL } from "os";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = require("../package.json");

const main = async () => {
  await Promise.all([
    shell("yarn tsc -p tsconfig.esm.json -d --emitDeclarationOnly --outDir ./lib/\\$types"),
    shell("yarn tsc -p tsconfig.cjs.json"),
    shell("yarn tsc -p tsconfig.esm.json"),
  ]);

  const exportsFiled = generateExportsField("./src", {
    directory: {
      node: "./lib/$cjs",
      require: "./lib/$cjs",
      import: "./lib/$esm",
      default: "./lib/$cjs",
    },
  });

  pkg.exports = exportsFiled;

  fs.writeFileSync("package.json", JSON.stringify(pkg, null, 2) + EOL, { encoding: "utf-8" });
};

main().catch(error => {
  console.error(error);
  process.exit(1);
});
