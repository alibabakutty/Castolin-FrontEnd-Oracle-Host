//import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ContextProvider from './context/ContextProvider.jsx'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { Provider } from 'react-redux'
import store from './store/store.js'

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <ContextProvider>
      <Provider store={store}>
        <ToastContainer />
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </ContextProvider>
  // </StrictMode>,
)
