import * as fs from "fs";
import * as path from "path";

import { CodeGenerator } from "@himenon/openapi-typescript-code-generator";
import * as Templates from "@himenon/openapi-typescript-code-generator/templates";
import type * as Types from "@himenon/openapi-typescript-code-generator/types";

export const generateTsCode = (entryPoint: string, outputFileName: string): void => {
  const codeGenerator = new CodeGenerator(entryPoint, {
    convertOption: {},
    allowOperationIds: [
      "git/get-ref",
      "git/create-ref",
      "git/create-blob",
      "git/create-tree",
      "git/create-commit",
      "git/get-tree",
      "git/update-ref",
      "repos/get",
      "repos/get-commit",
      "repos/list-branches",
      "repos/list-tags",
    ],
  });

  const apiClientGeneratorTemplate: Types.CodeGenerator.CustomGenerator<Templates.FunctionalApiClient.Option> = {
    generator: Templates.FunctionalApiClient.generator,
    option: {
      additionalMethodComment: true,
    },
  };

  const code = codeGenerator.generateTypeDefinition([
    codeGenerator.getAdditionalTypeDefinitionCustomCodeGenerator(),
    apiClientGeneratorTemplate,
  ]);

  fs.mkdirSync(path.dirname(outputFileName), { recursive: true });
  fs.writeFileSync(outputFileName, code, {
    encoding: "utf-8",
  });
};

const main = () => {
  generateTsCode("openapi/ghes-3.4.yaml", "src/api.ts");
};

main();
