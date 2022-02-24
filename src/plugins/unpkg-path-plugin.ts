import * as esbuild from 'esbuild-wasm'
import localForage from 'localforage'

const baseUrl = 'https://unpkg.com'

const fileCache = localForage.createInstance({
  name: 'filecache'
})
     
export const unpkgPathPlugin = () => {
  return {
    name: 'unpkg-path-plugin',

    setup(build: esbuild.PluginBuild) {
      build.onResolve({ filter: /.*/ }, async (args: any) => {
        if (args.path === 'index.js') return { path: args.path, namespace: 'a' }

        if(args.path.includes('./') || args.path.includes('../')) {
          return {
            namespace: 'a',
            path: new URL(args.path, baseUrl + args.resolveDir + '/').href
          }
        }

        return {
          namespace: 'a',
          path: baseUrl + '/' + args.path
        }
      })
 
      build.onLoad({ filter: /.*/ }, async (args: any) => {
        if (args.path === 'index.js') {
          return {
            loader: 'jsx',
            contents: `
              import message from 'react'
              console.log(message)
            `,
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