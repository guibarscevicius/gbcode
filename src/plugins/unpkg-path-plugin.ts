import * as esbuild from 'esbuild-wasm'
import localForage from 'localforage'

const baseUrl = 'https://unpkg.com'

const fileCache = localForage.createInstance({
  name: 'filecache'
})
     
export const unpkgPathPlugin = (input: string) => {
  return {
    name: 'unpkg-path-plugin',

    setup(build: esbuild.PluginBuild) {
      build.onResolve(
        { filter: /(^index\.js)/ },
        () => ({ path: 'index.js', namespace: 'a' })
      )

      build.onResolve(
        { filter: /^\.+\// },
        (args: any) => ({
          namespace: 'a',
          path: new URL(args.path, baseUrl + args.resolveDir + '/').href
        })
      )

      build.onResolve(
        { filter: /.*/ },
        async (args: any) => {
          return {
            namespace: 'a',
            path: baseUrl + '/' + args.path
          }
        }
      )
 
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
    },
  }
}