import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { applyMiddleware, configureStore } from '@reduxjs/toolkit'
import reduxThunk from 'redux-thunk'

import App from './components/App'
import reducers from './reducers'

const store = configureStore(reducers, {}, applyMiddleware(reduxThunk))

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container)
root.render(
    <Provider store={store}>
        <App />
    </Provider>
)