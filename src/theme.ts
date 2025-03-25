import { createTheme, PaletteMode } from '@mui/material';

// Создаем тему
export const getTheme = (mode: PaletteMode) => createTheme({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
        // Светлая тема
        primary: {
          main: '#444444',
        },
        secondary: {
          main: '#f50057',
        },
        background: {
          default: '#f5f5f5',
          paper: '#ffffff',
        },
      }
      : {
        // Тёмная тема, основанная на примере из изображений
        primary: {
          main: '#444444',
        },
        secondary: {
          main: '#f50057',
        },
        background: {
          default: '#121212',
          paper: '#1e1e1e',
        },
        text: {
          primary: '#ffffff',
          secondary: 'rgba(255, 255, 255, 0.7)',
        },
      }),
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: ({ theme }) => ({
          ...(theme.palette.mode === 'dark' && {
            backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))',
          }),
        }),
      },
    },
    MuiButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          ...(theme.palette.mode === 'dark' && {
            color: theme.palette.text.primary,
          }),
        }),
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: ({ theme }) => ({
          ...(theme.palette.mode === 'dark' && {
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
          }),
        }),
      },
    },
    MuiCssBaseline: {
      styleOverrides: (theme) => ({
        body: {
          scrollbarColor: theme.palette.mode === 'dark' ? '#6b6b6b transparent' : '#959595 transparent',
          '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
            backgroundColor: 'transparent',
            width: '8px',
          },
          '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
            borderRadius: 8,
            backgroundColor: theme.palette.mode === 'dark' ? '#6b6b6b' : '#959595',
            minHeight: 24,
          },
          '&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus': {
            backgroundColor: theme.palette.mode === 'dark' ? '#959595' : '#6b6b6b',
          },
          '&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active': {
            backgroundColor: theme.palette.mode === 'dark' ? '#959595' : '#6b6b6b',
          },
          '&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover': {
            backgroundColor: theme.palette.mode === 'dark' ? '#959595' : '#6b6b6b',
          },
        },
      }),
    },
  },
}); 