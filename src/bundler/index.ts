import esbuild from 'esbuild-wasm'

import { unpkgPathPlugin } from './plugins/unpkg-path-plugin'
import { fetchPlugin } from './plugins/fetch-plugin'
import { cachePlugin } from './plugins/cache-plugin'

(async () => {
  await esbuild.initialize({
    worker: true,
    wasmURL: 'https://unpkg.com/esbuild-wasm@0.14.23/esbuild.wasm'
  })
})()

const bundler = async (rawCode: string) => {
  const { outputFiles: [ outputFile ] } = await esbuild.build({
    entryPoints: ['index.js'],
    bundle: true,
    write: false,
    plugins: [unpkgPathPlugin(), cachePlugin(), fetchPlugin(rawCode)],
    define: {
      'process.env.NODE_ENV': '"production"',
      global: 'window',
    },
  })

  return outputFile.text
}

export default bundler