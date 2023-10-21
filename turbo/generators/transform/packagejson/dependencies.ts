//

export default async function dependencies(content: string) {
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
    ...dependencies.filter(is_workspace_version).map(async (package_name) => {
      const version = await get_latest_version(package_name);
      pkg.dependencies![package_name] = `${version}`;
    }),
    ...devDependencies
      .filter(is_workspace_version)
      .map(async (package_name) => {
        const version = await get_latest_version(package_name);
        pkg.devDependencies![package_name] = `${version}`;
      }),
  ]);

  return JSON.stringify(pkg, null, 2);
}
