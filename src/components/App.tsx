import 'bulmaswatch/superhero/bulmaswatch.min.css'
import esbuild from 'esbuild-wasm'
import { useState, useEffect, useRef } from 'react'

import CodeEditor from './code-editor'

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
    iframe.current.srcdoc = html

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
            try {
              eval(event.data)
            } catch (err) {
              document.querySelector('#root')
                .innerHTML = '<div style="color: red">'
                   + '<h4>Runtime error</h4>'
                   + '<p>' + err + '</p>'
                + '</div>'
              console.error(error)
            }
          }, false)
        </script>
      </body>
    </html>
  `

  return (
    <div>
      <CodeEditor
        initialValue={input}
        onChange={v => v && setInput(v)}
      />

      <div>
        <button onClick={onClick}>Submit</button>
      </div>

      <iframe
        ref={iframe}
        title="preview"
        sandbox="allow-scripts"
        srcDoc={html}
      />
    </div>
  )
}

export default App