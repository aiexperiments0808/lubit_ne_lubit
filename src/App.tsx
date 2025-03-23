import React, { useState, useEffect } from 'react';
import { Container, Box, Paper, Typography, CssBaseline, ThemeProvider as MuiThemeProvider, Alert, IconButton, Tooltip, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ExportInstructions from './components/ExportInstructions';
import FileUpload from './components/FileUpload';
import Chat from './components/Chat';
import Settings from './components/Settings';
import { hasApiKey } from './services/geminiService';
import { ThemeProvider } from './contexts/ThemeContext';
import { useThemeContext } from './contexts/ThemeContext';
import { getTheme } from './theme';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

// Компонент оболочки с доступом к ThemeContext
const AppWithTheme: React.FC = () => {
  const { mode, toggleTheme } = useThemeContext();
  const theme = getTheme(mode);
  const isDarkMode = mode === 'dark';

  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [showResetConfirmation, setShowResetConfirmation] = useState(false);

  // Эффект для проверки ключа при первом запуске
  useEffect(() => {
    if (!hasApiKey()) {
      setIsSettingsOpen(true);
    }
  }, []);

  // Эффект для автоматического закрытия уведомления
  useEffect(() => {
    if (showResetConfirmation) {
      const timer = setTimeout(() => {
        setShowResetConfirmation(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [showResetConfirmation]);

  const handleAnalysisComplete = (result: string) => {
    setAnalysisResult(result);
  };

  const handleOpenSettings = () => {
    setIsSettingsOpen(true);
  };

  const handleCloseSettings = () => {
    setIsSettingsOpen(false);
  };

  const handleSettingsSave = () => {
    // Форсируем обновление компонентов
    setForceUpdate(prev => prev + 1);
  };

  const handleOpenResetDialog = () => {
    setIsResetDialogOpen(true);
  };

  const handleCloseResetDialog = () => {
    setIsResetDialogOpen(false);
  };

  const handleResetAll = () => {
    // Сбрасываем результат анализа
    setAnalysisResult(null);
    // Увеличиваем счетчик для форсирования обновления компонентов
    setForceUpdate(prev => prev + 1);
    // Закрываем диалог
    setIsResetDialogOpen(false);
    // Показываем сообщение об успешной очистке
    setShowResetConfirmation(true);
  };

  const handleCloseSnackbar = () => {
    setShowResetConfirmation(false);
  };

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      
      {/* Сообщение об успешной очистке данных */}
      <Dialog
        open={showResetConfirmation}
        hideBackdrop={false}
        disableEscapeKeyDown={false}
        PaperProps={{
          sx: {
            backgroundColor: 'transparent',
            boxShadow: 'none',
            maxWidth: '90%',
            margin: 0
          }
        }}
        onClose={handleCloseSnackbar}
      >
        <Box
          sx={{
            backgroundColor: mode === 'light' ? 'rgba(56, 142, 60, 0.9)' : '#43a047',
            color: '#fff',
            fontSize: '1.2rem',
            padding: '16px 24px',
            borderRadius: '8px',
            textAlign: 'center',
            boxShadow: 3
          }}
        >
          Все ваши личные данные успешно удалены
        </Box>
      </Dialog>
      
      <Container maxWidth="md">
        <Paper 
          elevation={3} 
          sx={{ 
            my: 4, 
            p: 3, 
            borderRadius: 2,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography 
              variant="h4" 
              component="h1" 
              gutterBottom
              sx={{ mb: 0, display: 'flex', alignItems: 'center' }}
            >
              <Box 
                component="span" 
                sx={{ 
                  mr: 1, 
                  display: 'inline-flex', 
                  color: '#ffffff',
                  backgroundColor: '#FF9800',
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <ChatBubbleOutlineIcon />
              </Box>
              <Box component="span" sx={{ color: 'primary.main' }}>ЛюБит</Box>
              <Box component="span" sx={{ color: 'secondary.main' }}> / </Box>
              <Box component="span" sx={{ color: 'primary.main' }}>Не люБит</Box>
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title={mode === 'light' ? "Включить тёмную тему" : "Включить светлую тему"}>
                <IconButton onClick={toggleTheme} color="inherit">
                  {mode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
                </IconButton>
              </Tooltip>
              <Tooltip title="Настройки приложения">
                <IconButton 
                  color={hasApiKey() ? "primary" : "error"}
                  onClick={handleOpenSettings}
                  size="large"
                >
                  <SettingsIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
          
          <Typography 
            variant="body1" 
            color="text.secondary" 
            align="center"
            sx={{ mb: 4 }}
          >
            Анализ переписки между людьми с помощью искусственного интеллекта
          </Typography>

          {!hasApiKey() && (
            <Alert severity="warning" sx={{ mb: 3 }}>
              Для работы приложения необходимо добавить API ключ Gemini в настройках.
            </Alert>
          )}

          {!analysisResult ? (
            <>
              <ExportInstructions />
              <FileUpload key={`upload-${forceUpdate}`} onAnalysisComplete={handleAnalysisComplete} />
              
              {/* Кнопка "Забыть всё" в режиме загрузки */}
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Button 
                  variant="outlined" 
                  color="error" 
                  startIcon={<DeleteForeverIcon />} 
                  onClick={handleOpenResetDialog}
                  sx={{ 
                    borderRadius: 2,
                    py: 1,
                    px: 3,
                    fontSize: '0.9rem',
                    ...(isDarkMode && {
                      borderColor: 'rgba(211, 47, 47, 0.5)',
                      color: '#f44336'
                    })
                  }}
                >
                  Забыть всё
                </Button>
              </Box>
            </>
          ) : (
            <Box sx={{ mt: 3 }}>
              <Chat key={`chat-${forceUpdate}`} initialAnalysis={analysisResult} />
              
              {/* Кнопка "Забыть всё" в режиме чата */}
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Button 
                  variant="contained" 
                  color="error" 
                  startIcon={<DeleteForeverIcon />} 
                  onClick={handleOpenResetDialog}
                  sx={{ 
                    borderRadius: 2,
                    py: 1,
                    px: 3,
                    fontSize: '0.9rem'
                  }}
                >
                  Забыть всё
                </Button>
              </Box>
            </Box>
          )}
        </Paper>

        {/* Компонент настроек */}
        <Settings 
          open={isSettingsOpen} 
          onClose={handleCloseSettings} 
          onSave={handleSettingsSave} 
        />

        {/* Диалог подтверждения сброса данных */}
        <Dialog 
          open={isResetDialogOpen} 
          onClose={handleCloseResetDialog}
          PaperProps={{
            sx: {
              ...(isDarkMode && {
                backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))'
              })
            }
          }}
        >
          <DialogTitle>Подтверждение сброса данных</DialogTitle>
          <DialogContent>
            <Typography>
              Вы уверены, что хотите удалить все загруженные файлы и историю чата? 
              Это действие нельзя отменить.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseResetDialog}>Отмена</Button>
            <Button 
              onClick={handleResetAll} 
              color="error" 
              variant="contained"
              startIcon={<DeleteForeverIcon />}
            >
              Забыть всё
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </MuiThemeProvider>
  );
};

// Корневой компонент с ThemeProvider
function App() {
  return (
    <ThemeProvider>
      <AppWithTheme />
    </ThemeProvider>
  );
}

export default App; 