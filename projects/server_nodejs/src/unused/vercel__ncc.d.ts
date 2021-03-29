// Type definitions for @vercel/ncc 0.27.0
// Project: https://github.com/vercel/ncc
// Definitions by: Cory Boyd <https://github.com/corytheboyd>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

// TODO maybe push this up to DefinitelyTyped, idk. Would want to verify any
//  typing with a `// ?` comment first.

declare function ncc<T extends vercel__ncc.BuildOptions>(
  entryFilePath: string,
  buildOptions: T
): T["watch"] extends true
  ? {
      /**
       *  Handler re-run on each build completion watch errors are reported
       *  on "err"
       * */
      handler: (
        cb: (build: vercel__ncc.Build & { err: Error }) => void
      ) => void;

      /**
       * Handler re-run on each rebuild start
       * */
      rebuild: (cb: () => void) => void;

      /**
       * Close the watcher
       * */
      close: () => void;
    }
  : Promise<vercel__ncc.Build>;

export = ncc;

// https://github.com/vercel/ncc#programmatically-from-nodejs
declare namespace vercel__ncc {
  type BuildOptions = {
    /**
     * Provide a custom cache path or disable caching
     * */
    cache?: string | boolean;

    /**
     * Externals to leave as requires of the build
     * */
    externals?: string[];

    /**
     * Directory outside of which never to emit assets
     * */
    filterAssetBase?: string;
    minify?: boolean;
    sourceMap?: boolean;
    sourceMapBasePrefix?: string;

    /**
     * when outputting a sourcemap, automatically include source-map-support
     * in the output file (increases output by 32kB).
     * */
    sourceMapRegister?: boolean;
    watch?: boolean;
    license?: string;
    v8cache?: boolean;
    quiet?: boolean;
    debugLog?: boolean;
  };

  type Build = {
    code: string; // ?
    map: string; // ?
    assets: {
      [fileName: string]: {
        source: string; // ?
        permissions: string[]; // ?
        symlinks: string[]; // ?
      };
    };
  };
}
