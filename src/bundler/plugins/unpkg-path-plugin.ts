import * as esbuild from 'esbuild-wasm'

const baseUrl = 'https://unpkg.com'
     
export const unpkgPathPlugin = () => {
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
    }
  }
}