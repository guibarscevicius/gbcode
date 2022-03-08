import 'bulmaswatch/superhero/bulmaswatch.min.css'
import { useState } from 'react'

import CodeEditor from './code-editor'
import Preview from './preview'
import bundle from '../bundler'

const App = () => {
  const [input, setInput] = useState('')
  const [code, setCode] = useState('')

  

  const onClick = async () => {
    setCode(await bundle(input))
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