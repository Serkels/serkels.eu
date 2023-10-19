//

import { type PlopTypes } from "@turbo/gen";
import { execSync } from "node:child_process";

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
    description: "Generate a @1.modules/<name>/{domain,api}",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "The name of the module",
      },
    ],
    actions: [
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
        templateFile: "templates/1.module/[name]/domain/package.json.hbs",
        async transform(content) {
          const pkg = JSON.parse(content) as {
            dependencies: Record<string, string>;
            devDependencies: Record<string, string>;
          };
          const is_workspace_version = (version: string) =>
            version.startsWith("workspace:");
          const dependencies = Object.keys(pkg.dependencies);
          const devDependencies = Object.keys(pkg.devDependencies);
          //filter((name) => pkg.dependencies[name]?.startsWith("workspace:"))
          async function get_latest_version(package_name: string) {
            return fetch(
              `https://registry.npmjs.org/-/package/${package_name}/dist-tags`,
            )
              .then((res) => res.json())
              .then((json) => json.latest);
          }
          await Promise.all([
            ...dependencies
              .filter(is_workspace_version)
              .map(async (package_name) => {
                const version = await get_latest_version(package_name);
                pkg.dependencies![package_name] = `^${version}`;
              }),
            ...devDependencies
              .filter(is_workspace_version)
              .map(async (package_name) => {
                const version = await get_latest_version(package_name);
                pkg.devDependencies![package_name] = `^${version}`;
              }),
          ]);

          return JSON.stringify(pkg, null, 2);
        },
      },

      { type: "format" },
      { type: "install" },
    ],
  });
}
