import MonacoEditor from '@monaco-editor/react'
import monaco from 'monaco-editor'

interface CodeEditorProps {
  initialValue: string,
  onChange(value: string | undefined, ev: monaco.editor.IModelContentChangedEvent): void
}

const CodeEditor: React.FC<CodeEditorProps> = ({ initialValue, onChange }) => {
  return (
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
      }}
      onChange={onChange}
    />
  )
}

export default CodeEditor