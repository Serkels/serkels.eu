//

import { type PlopTypes } from "@turbo/gen";
import { execSync } from "node:child_process";
import dependencies from "./transform/packagejson/dependencies";

//

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  plop.setActionType("format", function (answers) {
    const { name } = answers as { name: string };
    execSync(
      `pnpm prettier --write packages/@1/modules/${name}/** --list-different`,
    );
    return `packages/@1/modules/${name}/**`;
  });

  plop.setActionType("install", function () {
    try {
      execSync(`pnpm install`, { stdio: "inherit" });
    } catch (error) {
      return `pnpm ends with ${error}`;
    }
    return "pnpm";
  });

  //
  //
  //

  plop.setGenerator("1.module", {
    description: "Generate a @1.modules/<name>/{api,domain,ui}",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "The name of the module",
      },
    ],
    actions: [
      //
      // Domain
      {
        type: "add",
        path: "packages/@1/modules/{{lowerCase name}}/domain/.gitignore",
        templateFile: "templates/1.module/[name]/domain/.gitignore",
      },
      {
        type: "add",
        path: "packages/@1/modules/{{lowerCase name}}/domain/tsconfig.json",
        templateFile: "templates/1.module/[name]/domain/tsconfig.json",
      },
      {
        type: "add",
        path: "packages/@1/modules/{{lowerCase name}}/domain/src/index.ts",
        templateFile: "templates/1.module/[name]/domain/src/index.ts.hbs",
      },
      {
        type: "add",
        path: "packages/@1/modules/{{lowerCase name}}/domain/package.json",
        templateFile: "templates/1.module/[name]/domain/package.json",
        transform: dependencies,
      },

      //
      // API
      {
        type: "add",
        path: "packages/@1/modules/{{lowerCase name}}/api/.gitignore",
        templateFile: "templates/1.module/[name]/api/.gitignore",
      },
      {
        type: "add",
        path: "packages/@1/modules/{{lowerCase name}}/api/tsconfig.json",
        templateFile: "templates/1.module/[name]/api/tsconfig.json",
      },
      {
        type: "add",
        path: "packages/@1/modules/{{lowerCase name}}/api/src/index.ts",
        templateFile: "templates/1.module/[name]/api/src/index.ts.hbs",
      },
      {
        type: "add",
        path: "packages/@1/modules/{{lowerCase name}}/api/package.json",
        templateFile: "templates/1.module/[name]/api/package.json",
        transform: dependencies,
      },

      //
      // UI
      {
        type: "add",
        path: "packages/@1/modules/{{lowerCase name}}/ui/src/index.ts",
        templateFile: "templates/1.module/[name]/ui/src/index.ts",
      },
      {
        type: "add",
        path: "packages/@1/modules/{{lowerCase name}}/ui/.gitignore",
        templateFile: "templates/1.module/[name]/ui/.gitignore",
      },
      {
        type: "add",
        path: "packages/@1/modules/{{lowerCase name}}/ui/package.json",
        templateFile: "templates/1.module/[name]/ui/package.json",
        transform: dependencies,
      },
      {
        type: "add",
        path: "packages/@1/modules/{{lowerCase name}}/ui/prettier.config.js",
        templateFile: "templates/1.module/[name]/ui/prettier.config.js",
      },
      {
        type: "add",
        path: "packages/@1/modules/{{lowerCase name}}/ui/tailwind.config.ts",
        templateFile: "templates/1.module/[name]/ui/tailwind.config.ts",
      },
      {
        type: "add",
        path: "packages/@1/modules/{{lowerCase name}}/ui/tsconfig.json",
        templateFile: "templates/1.module/[name]/ui/tsconfig.json",
      },

      //
      // Lastly
      { type: "install" },
      { type: "format" },
    ],
  });
}
