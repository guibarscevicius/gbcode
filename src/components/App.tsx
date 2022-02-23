import esbuild from 'esbuild-wasm'
import { useState, useEffect, useRef } from 'react'

console.log(esbuild)

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
    const result = await esbuild.transform(input, {
      loader: 'jsx',
      target: 'es2015'
    })

    setCode(result.code)
  }

  return (
    <div>
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
      ></textarea>

      <div>
        <button onClick={onClick}>Submit</button>
      </div>

      <pre>{code}</pre>
    </div>
  )
}

export default App