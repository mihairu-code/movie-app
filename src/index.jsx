import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import 'antd/dist/reset.css'
import './index.less'
import App from './Components/App/App.jsx'

const rootElement = document.getElementById('root') // Изменено на div с id="root"
const root = createRoot(rootElement)
root.render(
  <StrictMode>
    <App />
  </StrictMode>
)
