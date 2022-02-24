import * as esbuild from 'esbuild-wasm'
import localForage from 'localforage'

export const fileCache = localForage.createInstance({
  name: 'filecache'
})

export const cachePlugin = () => {
  return {
    name: 'cache-plugin',
    setup(build: esbuild.PluginBuild) {
      build.onLoad({ filter: /.*/ }, async (args: any) =>
        await fileCache.getItem<esbuild.OnLoadResult>(args.path)
      )
    }
  }
}