import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ThemeProvider } from '@emotion/react'
import theme from './theme.js'
import StratagemHero from './pages/StratagemHero.jsx'
import StratagemHeroGame from './components/StratagemHero.jsx'
import { Box } from '@mui/material'
import StratagemHeroConsole from './pages/StratagemHero.jsx'
import OnScreenDpad from './components/OnScreenButtons.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <Box sx={{
        height: '100%',
        width: '100%'
      }}>
        <StratagemHeroConsole>
          <StratagemHeroGame />
        </StratagemHeroConsole>
      </Box>
    </ThemeProvider>
  </React.StrictMode >,
)
