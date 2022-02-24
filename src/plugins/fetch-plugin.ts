import * as esbuild from 'esbuild-wasm'
import localForage from 'localforage'

const fileCache = localForage.createInstance({
  name: 'filecache'
})

export const fetchPlugin = (input: string) => {
  return {
    name: 'fetch-plugin',
    setup(build: esbuild.PluginBuild) {
      build.onLoad({ filter: /^index\.js$/ },
        () => ({ loader: 'jsx', contents: input }))

      build.onLoad({ filter: /.css$/ }, async (args: any) => {
        const cached = await fileCache.getItem<esbuild.OnLoadResult>(args.path)
        if (cached) return cached

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
        const cached = await fileCache.getItem<esbuild.OnLoadResult>(args.path)
        if (cached) return cached

        const response = await fetch(args.path)
        const data = await response.text()

        const result: esbuild.OnLoadResult = {
          loader: 'jsx',
          contents: data,
          resolveDir: new URL('./', response.url).pathname
        }

        await fileCache.setItem(args.path, result)

        return result
      })
    }
  }
}