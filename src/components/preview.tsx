import { useEffect, useRef } from 'react'

interface PreviewProps {
  code: string
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
              console.log(event.data)
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

const Preview: React.FC<PreviewProps> = ({ code }) => {
  const iframe = useRef<any>()

  useEffect(() => {
    iframe.current.srcdoc = html
    iframe.current.contentWindow.postMessage(code, '*')
  }, [code])

  return (
    <iframe
      ref={iframe}
      title="preview"
      sandbox="allow-scripts"
      srcDoc={html}
    />
  )
}

export default Preview