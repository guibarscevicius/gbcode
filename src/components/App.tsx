import 'bulmaswatch/superhero/bulmaswatch.min.css'
import esbuild from 'esbuild-wasm'
import { useState, useEffect } from 'react'

import CodeEditor from './code-editor'
import Preview from './preview'

import { unpkgPathPlugin } from '../plugins/unpkg-path-plugin'
import { fetchPlugin } from '../plugins/fetch-plugin'
import { cachePlugin } from '../plugins/cache-plugin'

const App = () => {
  const [input, setInput] = useState('')
  const [code, setCode] = useState('')

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

    setCode(result.outputFiles[0].text)
  }

  

  return (
    <div>
      <CodeEditor
        initialValue={input}
        onChange={v => v && setInput(v)}
      />

      <div>
        <button onClick={onClick}>Submit</button>
      </div>

      <Preview code={code} />
    </div>
  )
}

export default App