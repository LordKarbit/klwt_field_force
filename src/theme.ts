import { createTheme } from '@mui/material/styles';

export const appTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#2fd0a8',
      light: '#7be7ce',
      dark: '#149374',
    },
    secondary: {
      main: '#f5c84c',
      light: '#ffdf7b',
      dark: '#bd8f10',
    },
    error: {
      main: '#ff6b6b',
    },
    warning: {
      main: '#f3a43b',
    },
    success: {
      main: '#48d597',
    },
    info: {
      main: '#61c8ff',
    },
    background: {
      default: '#07100f',
      paper: '#101817',
    },
    text: {
      primary: '#f3fbf8',
      secondary: '#aab9b5',
    },
    divider: 'rgba(222, 244, 237, 0.1)',
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily: [
      'Plus Jakarta Sans',
      'Manrope',
      'Segoe UI',
      'sans-serif',
    ].join(','),
    h1: {
      fontWeight: 800,
      letterSpacing: 0,
    },
    h2: {
      fontWeight: 800,
      letterSpacing: 0,
    },
    h3: {
      fontWeight: 800,
      letterSpacing: 0,
    },
    h4: {
      fontWeight: 800,
      letterSpacing: 0,
    },
    h5: {
      fontWeight: 800,
      letterSpacing: 0,
    },
    h6: {
      fontWeight: 800,
      letterSpacing: 0,
    },
    button: {
      textTransform: 'none',
      fontWeight: 700,
      letterSpacing: 0,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: '1px solid rgba(222, 244, 237, 0.08)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: 'none',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 700,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 800,
        },
      },
    },
  },
});
