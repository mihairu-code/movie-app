import React from 'react'
import ReactDOM from 'react-dom'

import './index.less'

import ExampleComponent from './Components/ExampleComponent/ExampleComponent'

const App = () => (
  <div>
    <h1>Movie App</h1>
    <ExampleComponent />
  </div>
)

ReactDOM.render(<App />, document.getElementById('root'))
