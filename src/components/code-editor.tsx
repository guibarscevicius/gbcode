import './code-editor.css'
import { useRef } from 'react'
import MonacoEditor from '@monaco-editor/react'
import monaco from 'monaco-editor'
import prettier from 'prettier'
import parser from 'prettier/parser-babel'

interface CodeEditorProps {
  initialValue: string,
  onChange(value: string | undefined, ev: monaco.editor.IModelContentChangedEvent): void
}

const CodeEditor: React.FC<CodeEditorProps> = ({ initialValue, onChange }) => {
  const editorRef = useRef<any>()

  const onFormatClick = () => {
    const unformatted = editorRef.current.getModel().getValue()

    const formatted = prettier.format(unformatted, {
      parser: 'babel',
      plugins: [parser],
      useTabs: false,
      semi: false,
      singleQuote: true,
    })
    
    editorRef.current.setValue(formatted)
  }

  const onEditorMount = (editor: monaco.editor.IStandaloneCodeEditor) => {
    editorRef.current = editor
  }

  return (
    <div className="editor-wrapper">
      <button
        className="button button-format is-primary is-small"
        onClick={onFormatClick}
      >Format</button>
      
      <MonacoEditor
        value={initialValue}
        height="500px"
        theme="vs-dark"
        defaultLanguage="javascript"
        options={{
          wordWrap: 'on',
          minimap: { enabled: false },
          showUnused: false,
          folding: false,
          lineNumbersMinChars: 3,
          fontSize: 16,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
        }}
        onMount={onEditorMount}
        onChange={onChange}
      />
    </div>
  )
}

export default CodeEditor