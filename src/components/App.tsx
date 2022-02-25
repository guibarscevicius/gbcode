import esbuild from 'esbuild-wasm'
import { useState, useEffect, useRef } from 'react'

import { unpkgPathPlugin } from '../plugins/unpkg-path-plugin'
import { fetchPlugin } from '../plugins/fetch-plugin'
import { cachePlugin } from '../plugins/cache-plugin'

const App = () => {
  const iframe = useRef<any>()
  const [input, setInput] = useState('')

  const startService = async () => {
    await esbuild.initialize({
      worker: true,
      wasmURL: 'https://unpkg.com/esbuild-wasm@0.14.23/esbuild.wasm'
    })
  }

  useEffect(() => { startService() }, [])

  const onClick = async () => {
    const result = await esbuild.build({
      entryPoints: ['index.js'],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(), cachePlugin(), fetchPlugin(input)],
      define: {
        'process.env.NODE_ENV': '"production"',
        global: 'window',
      },
    })

    iframe.current.contentWindow.postMessage(result.outputFiles[0].text, '*')
  }

  const html = `
    <html>
      <head></head>
      <body>
        <div id="root"></div>
        <script>
          window.addEventListener('message', (event) => {
            eval(event.data)
          }, false)
        </script>
      </body>
    </html>
  `

  return (
    <div>
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
      ></textarea>

      <div>
        <button onClick={onClick}>Submit</button>
      </div>

      <iframe
        ref={iframe}
        title="code"
        sandbox="allow-scripts"
        srcDoc={html}
      />
    </div>
  )
}

export default App