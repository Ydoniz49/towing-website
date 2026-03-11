import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import 'leaflet/dist/leaflet.css'
import App from './App.tsx'
import { ThemeProvider, CssBaseline, createTheme } from '@mui/material'

// Create a theme and override Button hover to keep white text and stable bg
let theme = createTheme()
theme = createTheme(theme, {
  palette: {
    primary: {
      main: '#ff385c',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#2a2f36',
      contrastText: '#ffffff',
    },
    background: {
      default: '#191c22',
      paper: '#232830',
    },
    text: {
      primary: '#f5f7fa',
      secondary: '#cfd6df',
    },
  },
})
theme = createTheme(theme, {
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 999,
          fontWeight: 600,
          textTransform: 'none',
        },
        containedPrimary: {
          color: theme.palette.primary.contrastText,
          '&:hover': {
            color: theme.palette.primary.contrastText,
            backgroundColor: theme.palette.primary.main, // keep bg unchanged on hover
          },
        },
        containedSecondary: {
          color: theme.palette.common.white,
          '&:hover': {
            color: theme.palette.common.white,
            backgroundColor: theme.palette.secondary.main, // keep bg unchanged on hover
          },
        },
      },
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)
