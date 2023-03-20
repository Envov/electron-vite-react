import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './samples/node-api'
import './index.scss'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis cupiditate maxime vel cum quod consequatur, aliquam temporibus delectus adipisci provident dolorum ex vero id vitae officiis dolores possimus. Quibusdam, facilis.
  </React.StrictMode>,
)

postMessage({ payload: 'removeLoading' }, '*')
