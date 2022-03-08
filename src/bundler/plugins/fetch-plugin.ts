import * as esbuild from 'esbuild-wasm'

import { fileCache } from './cache-plugin'

export const fetchPlugin = (input: string) => {
  return {
    name: 'fetch-plugin',
    setup(build: esbuild.PluginBuild) {
      build.onLoad({ filter: /^index\.js$/ },
        () => ({ loader: 'jsx', contents: input }))

      build.onLoad({ filter: /.css$/ }, async (args: any) => {
        const response = await fetch(args.path)
        const data = await response.text()

        const contents = `
            const style = document.createElement('style')
            style.innerText = '${data
              .replace(/\n/g, '')
              .replace(/"/g, '\\')
              .replace(/'/g, "\\'")
            }'
          `

        const result: esbuild.OnLoadResult = {
          loader: 'jsx',
          contents,
          resolveDir: new URL('./', response.url).pathname
        }

        await fileCache.setItem(args.path, result)

        return result
      })

      build.onLoad({ filter: /.*/ }, async (args: any) => {
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