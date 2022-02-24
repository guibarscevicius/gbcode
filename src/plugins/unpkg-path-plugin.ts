import * as esbuild from 'esbuild-wasm'

const baseUrl = 'https://unpkg.com'
     
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

        const response = await fetch(args.path)

        return {
          loader: 'jsx',
          contents: await response.text(),
          resolveDir: new URL('./', response.url).pathname
        }
      })
    },
  }
}