import { useState } from 'react'

import Resizable from './resizable'
import CodeEditor from './code-editor'
import Preview from './preview'

import bundle from '../bundler'

const CodeCell = () => {
  const [input, setInput] = useState('')
  const [code, setCode] = useState('')
  
  const onClick = async () => {
    setCode(await bundle(input))
  }

  return (
    <Resizable direction="vertical">
      <div style={{
        height: '100%',
        display: 'flex',
        flex: 'row nowrap',
      }}>
        <CodeEditor
          initialValue={input}
          onChange={v => v && setInput(v)}
        />

        <Preview code={code} />
      </div>
    </Resizable>
  )
}

export default CodeCell