import * as esbuild from 'esbuild-wasm'
import localForage from 'localforage'

const fileCache = localForage.createInstance({
  name: 'filecache'
})

export const fetchPlugin = (input: string) => {
  return {
    name: 'fetch-plugin',
    setup(build: esbuild.PluginBuild) {
      build.onLoad({ filter: /.*/ }, async (args: any) => {
        if (args.path === 'index.js') {
          return {
            loader: 'jsx',
            contents: input,
          }
        }

        const cached = await fileCache.getItem<esbuild.OnLoadResult>(args.path)
        if (cached) return cached

        const response = await fetch(args.path)

        const result: esbuild.OnLoadResult = {
          loader: 'jsx',
          contents: await response.text(),
          resolveDir: new URL('./', response.url).pathname
        }

        await fileCache.setItem(args.path, result)

        return result
      })
    }
  }
}