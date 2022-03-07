import buffer from 'buffer'
(window as any).Buffer = buffer

window.process = window.process || { env: {} }