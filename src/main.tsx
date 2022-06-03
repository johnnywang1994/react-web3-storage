import React from 'react'
import ReactDOM from 'react-dom/client'
import 'antd/dist/antd.css'
import App from './App'
import { StoreProvider } from './store'
import GlobalStyle from './styles/global'
import StyledThemeProvider from './styles/theme'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <StyledThemeProvider>
      <GlobalStyle />
      <StoreProvider>
        <App />
      </StoreProvider>
    </StyledThemeProvider>
  </React.StrictMode>
)
