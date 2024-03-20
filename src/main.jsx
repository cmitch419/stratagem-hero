import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ThemeProvider } from '@emotion/react'
import theme from './theme.js'
import StratagemHero from './pages/StratagemHero.jsx'
import StratagemHeroGame from './components/StratagemHero.jsx'
import { Box } from '@mui/material'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <Box width="100vw" height="100vh">
        <StratagemHero>
          <StratagemHeroGame />
        </StratagemHero>
      </Box>
    </ThemeProvider>
  </React.StrictMode >,
)
