export interface DllPackageConfig {
  name: string;
  path: string;
}

export interface DllBundleConfig {
  name: string;
  packages: Array<string | DllPackageConfig>;
}

export interface BundleCacheIdFunction {
  (bundleName: string): string;
}

export interface DllBundlesPluginOptions {
  bundles: { [key: string]: Array<string | DllPackageConfig>}

  /**
   * Webpack configuration object.
   * Can be a path, an config object or a config object factory
   *
   * If the path (string) is relative, resolved using the context option.
   */
  webpackConfig: string | any;

  /**
   * The directory to store bundles and metadata it.
   *
   * If not absolute context is process.cwd()
   */
  dllDir: string;


  /**
   * If true will ignore any errors resulted from package resolution.
   * Such errors can be name mismatch, packages not found, package.json not found etc...
   *
   * Error resolution errors does not mean a bundle can not build, if the package exists it will build.
   * These errors mean that there was no exact match so the build state is not known and as a result
   * the next check will result in a rebuild. If a package error is not fixed it essentially means that
   * the bundle will build every time, no caching.
   *
   * When using node modules as packages in the bundle this should be left FALSE.
   * When using a path to a file/directory that is part of the project or does not have package.json file next to it then
   * you should set this value to TRUE. (read comment below)
   *
   * > Having files within the project as packages inside a DLL bundle is possible but not recommended.
   * It is difficult to detect changes in the tree created by the file so `DllBundlesPlugin` will ignore it
   * making it appear as "changed" for every check for updates in the bundle hence re-building the DLL bundle every time.
   * Using the plugin with such behaviour makes no sense, make sure to add a "package.json" file next
   * to the file you reference as well as update it's version on every change.
   *
   * > While setting ignorePackageError to TRUE will not throw if a package was not found Webpack will.
   *
   * @default false
   */
  ignorePackageError?: boolean;

  /**
   * The context for the plugin.
   *
   * Used as context for internal plugins, e.g: DllReferencePlugin
   * Used as context for dllDir (if relative)
   *
   * @default process.cwd()
   */
  context?: string;

  /**
   * Bundle cache ID (checksum) that will be used as additional parameter to check cache validity.
   *
   * By default bundle cache is considered to be valid if it contains the same modules with the same versions.
   * It doesn't take into account any extra parameters e.g. webpack configuration so, for example, normal and minified
   * bundle with the same modules will be considered equal and won't be rebuilt.
   *
   * This options helps to solve it: you can construct any string that will identify this build of the bundle.
   *
   * For example, you can set something like this:
   * `JSON.stringify({env: webpackConfigOpts.env, minify: webpackConfigOpts.minify})`.
   *
   * Resulting string will be save to `dll-bundles-state.json` and bundle will be rebuilt if it doesn't match
   * the new value.
   *
   * Can be a string or a function returning a string.
   *
   * @default undefined
   */
  bundleCacheId?: string | BundleCacheIdFunction;
}
