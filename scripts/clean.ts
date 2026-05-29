import { rimraf } from "rimraf";

const main = async () => {
  await rimraf("lib");
  await rimraf("dist");
};

main().catch(error => {
  console.error(error);
  process.exit(1);
});
