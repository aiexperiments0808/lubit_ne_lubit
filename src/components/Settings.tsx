import React, { useState, useEffect, useCallback } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField, 
  Link, 
  Box, 
  Tabs, 
  Tab, 
  Alert, 
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  SelectChangeEvent,
  useTheme,
  Tooltip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { 
  getApiKey, 
  setApiKey, 
  getSystemPrompt, 
  setSystemPrompt,
  getModelName,
  setModelName,
  listAvailableModels
} from '../services/geminiService';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import MemoryIcon from '@mui/icons-material/Memory';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

interface SettingsProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// Информация о моделях для отображения
const MODEL_INFO: Record<string, { description: string, recommended?: boolean }> = {
  'gemini-2.0-flash': {
    description: 'Новейшая быстрая модель с отличной производительностью и низкой стоимостью',
    recommended: true
  },
  'gemini-1.5-pro': {
    description: 'Самая мощная мультимодальная модель с расширенным контекстом',
    recommended: true
  },
  'gemini-1.5-flash': {
    description: 'Быстрая модель с хорошим балансом производительности и скорости',
    recommended: false
  },
  'gemini-pro': {
    description: 'Классическая модель Gemini для текстовых задач',
  },
  'gemini-pro-vision': {
    description: 'Классическая модель Gemini с поддержкой изображений',
  }
};

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `settings-tab-${index}`,
    'aria-controls': `settings-tabpanel-${index}`,
  };
}

// Функция для отображения содержимого вкладки безопасности
function SecurityContent() {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Безопасность вашей информации
      </Typography>
      
      <Typography paragraph>
        Мы заботимся о безопасности ваших данных. Вот как наше приложение обрабатывает вашу информацию:
      </Typography>
      
      <List 
        disablePadding 
        sx={{ 
          bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
          borderRadius: 1,
          mt: 2
        }}
      >
        <ListItem>
          <ListItemIcon>
            <CloudUploadIcon color="primary" />
          </ListItemIcon>
          <ListItemText 
            primary="Загрузка данных" 
            secondary="Ваши чаты загружаются только в браузер и обрабатываются локально. Мы не сохраняем ваши переписки на наших серверах."
          />
        </ListItem>
        
        <ListItem>
          <ListItemIcon>
            <MemoryIcon color="primary" />
          </ListItemIcon>
          <ListItemText 
            primary="Анализ искусственным интеллектом" 
            secondary="Для анализа ваших чатов мы используем API Google Gemini. Текст отправляется в Google для обработки согласно их политике конфиденциальности."
          />
        </ListItem>
        
        <ListItem>
          <ListItemIcon>
            <LinkOffIcon color="primary" />
          </ListItemIcon>
          <ListItemText 
            primary="Политика Google Gemini" 
            secondary="Подробную информацию о том, как Google обрабатывает данные, можно найти в документации Google Gemini."
          />
        </ListItem>
        
        <ListItem>
          <ListItemIcon>
            <DeleteForeverIcon color="primary" />
          </ListItemIcon>
          <ListItemText 
            primary="Удаление данных" 
            secondary="Вы можете в любой момент удалить всю информацию, нажав кнопку 'Забыть всё'. Все данные хранятся только локально в вашем браузере."
          />
        </ListItem>
      </List>
      
      <Box sx={{ mt: 3, bgcolor: isDarkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(25, 118, 210, 0.08)', p: 2, borderRadius: 1 }}>
        <Typography variant="subtitle2" color="primary" gutterBottom>
          Важное замечание:
        </Typography>
        <Typography variant="body2">
          Мы рекомендуем не загружать конфиденциальную информацию, такую как пароли, финансовые данные или любую личную информацию, которую вы не хотели бы передавать третьим лицам. Для получения наилучших результатов анализа достаточно текста сообщений.
        </Typography>
      </Box>
      
      <Button
        component="a"
        href="https://ai.google.dev/docs/safety_guidance"
        target="_blank"
        rel="noopener noreferrer"
        variant="outlined"
        startIcon={<OpenInNewIcon />}
        sx={{ mt: 3 }}
      >
        Политика Google Gemini
      </Button>
    </Box>
  );
}

const Settings: React.FC<SettingsProps> = ({ open, onClose, onSave }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  
  const [apiKey, setApiKeyState] = useState(getApiKey());
  const [systemPrompt, setSystemPromptState] = useState(getSystemPrompt());
  const [modelName, setModelNameState] = useState(getModelName());
  const [tabValue, setTabValue] = useState(0);
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [modelError, setModelError] = useState<string | null>(null);

  // Мемоизируем функцию loadAvailableModels с useCallback
  const loadAvailableModels = useCallback(async () => {
    if (!apiKey) return;
    
    setIsLoadingModels(true);
    setModelError(null);
    
    try {
      const models = await listAvailableModels();
      setAvailableModels(models);
    } catch (error) {
      setModelError((error as Error).message);
      console.error('Ошибка при получении списка моделей:', error);
    } finally {
      setIsLoadingModels(false);
    }
  }, [apiKey]);

  useEffect(() => {
    if (open && apiKey) {
      loadAvailableModels();
    }
  }, [open, apiKey, loadAvailableModels]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleClose = () => {
    onClose();
  };

  const handleSave = () => {
    setApiKey(apiKey.trim());
    setSystemPrompt(systemPrompt);
    setModelName(modelName);
    onSave();
    onClose();
  };

  const handleModelChange = (event: SelectChangeEvent<string>) => {
    setModelNameState(event.target.value);
  };

  const handleResetSystemPrompt = () => {
    // Сбрасываем к значению по умолчанию
    setSystemPromptState(getSystemPrompt(true));
  };

  // Получение описания модели
  const getModelDescription = (model: string) => {
    const baseModelName = model.replace(/^models\//, '');
    // Ищем совпадение по имени или префиксу модели
    const infoKey = Object.keys(MODEL_INFO).find(key => 
      baseModelName === key || baseModelName.startsWith(key + '-')
    );
    
    return infoKey ? MODEL_INFO[infoKey].description : '';
  };

  // Проверка, рекомендуется ли модель
  const isRecommendedModel = (model: string) => {
    const baseModelName = model.replace(/^models\//, '');
    const infoKey = Object.keys(MODEL_INFO).find(key => 
      baseModelName === key || baseModelName.startsWith(key + '-')
    );
    
    return infoKey ? MODEL_INFO[infoKey].recommended : false;
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          ...(isDarkMode && {
            backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))'
          })
        }
      }}
    >
      <DialogTitle>Настройки приложения</DialogTitle>
      <DialogContent>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="Настройки"
            sx={{
              '& .MuiTabs-indicator': {
                backgroundColor: theme.palette.primary.main,
              },
              '& .MuiTab-root': {
                color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : undefined,
                '&.Mui-selected': {
                  color: theme.palette.primary.main,
                },
              },
            }}
          >
            <Tab label="API ключ" {...a11yProps(0)} />
            <Tab label="Модель" {...a11yProps(1)} />
            <Tab label="Системный промпт" {...a11yProps(2)} />
            <Tab label="Безопасность" {...a11yProps(3)} />
          </Tabs>
        </Box>
        
        <TabPanel value={tabValue} index={0}>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Для работы приложения необходим API ключ от Gemini AI. 
            Получить его можно на сайте{' '}
            <Link 
              href="https://makersuite.google.com/app/apikey" 
              target="_blank" 
              rel="noopener noreferrer"
              sx={{ color: isDarkMode ? theme.palette.primary.light : undefined }}
            >
              Google AI Studio
            </Link>.
          </Typography>
          <Alert 
            severity="info" 
            sx={{ 
              mb: 2,
              ...(isDarkMode && {
                backgroundColor: 'rgba(33, 150, 243, 0.1)',
                color: theme.palette.primary.light
              })
            }}
          >
            Рекомендуется использовать модель <strong>gemini-2.0-flash</strong> или <strong>gemini-1.5-pro</strong>.
            Убедитесь, что ваш API ключ имеет доступ к этим моделям.
          </Alert>
          <TextField
            autoFocus
            margin="dense"
            label="API ключ"
            type="text"
            fullWidth
            variant="outlined"
            value={apiKey}
            onChange={(e) => setApiKeyState(e.target.value)}
            InputProps={{
              sx: {
                ...(isDarkMode && {
                  backgroundColor: 'rgba(255, 255, 255, 0.05)'
                })
              }
            }}
          />
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          {!apiKey ? (
            <Alert 
              severity="warning" 
              sx={{ 
                mb: 2,
                ...(isDarkMode && {
                  backgroundColor: 'rgba(255, 152, 0, 0.1)',
                  color: 'warning.light'
                })
              }}
            >
              Сначала необходимо добавить API ключ в соответствующей вкладке.
            </Alert>
          ) : (
            <>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Выберите модель Gemini, которая будет использоваться для анализа переписки.
              </Typography>
              
              <FormControl 
                fullWidth 
                sx={{ 
                  mt: 2,
                  '& .MuiOutlinedInput-root': {
                    ...(isDarkMode && {
                      backgroundColor: 'rgba(255, 255, 255, 0.05)'
                    })
                  }
                }}
              >
                <InputLabel id="model-select-label">Модель</InputLabel>
                <Select
                  labelId="model-select-label"
                  value={modelName}
                  label="Модель"
                  onChange={handleModelChange}
                  disabled={isLoadingModels}
                >
                  {isLoadingModels ? (
                    <MenuItem value="">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CircularProgress size={20} />
                        <span>Загрузка моделей...</span>
                      </Box>
                    </MenuItem>
                  ) : (
                    availableModels.map((model) => {
                      const displayName = model.replace(/^models\//, '');
                      const description = getModelDescription(model);
                      const isRecommended = isRecommendedModel(model);
                      
                      return (
                        <MenuItem 
                          key={model} 
                          value={model}
                          sx={{ 
                            flexDirection: 'column', 
                            alignItems: 'flex-start',
                            ...(isRecommended && {
                              backgroundColor: isDarkMode 
                                ? 'rgba(33, 150, 243, 0.08)'
                                : 'rgba(33, 150, 243, 0.05)',
                            })
                          }}
                        >
                          <Box sx={{ 
                            display: 'flex', 
                            width: '100%', 
                            alignItems: 'center',
                            justifyContent: 'space-between'
                          }}>
                            <Typography fontWeight={isRecommended ? 'bold' : 'normal'}>
                              {displayName}
                              {isRecommended && ' (рекомендуется)'}
                            </Typography>
                            
                            {description && (
                              <Tooltip title={description} arrow placement="right">
                                <InfoOutlinedIcon 
                                  fontSize="small" 
                                  sx={{ ml: 1, opacity: 0.7 }} 
                                />
                              </Tooltip>
                            )}
                          </Box>
                          
                          {description && (
                            <Typography 
                              variant="caption" 
                              color="text.secondary"
                              sx={{ mt: 0.5 }}
                            >
                              {description}
                            </Typography>
                          )}
                        </MenuItem>
                      );
                    })
                  )}
                </Select>
              </FormControl>
              
              {modelError && (
                <Alert 
                  severity="error" 
                  sx={{ 
                    mt: 2,
                    ...(isDarkMode && {
                      backgroundColor: 'rgba(211, 47, 47, 0.15)',
                      color: '#f44336'
                    })
                  }}
                >
                  Ошибка при загрузке списка моделей: {modelError}
                </Alert>
              )}
              
              <Button 
                variant="outlined" 
                sx={{ mt: 2 }} 
                onClick={loadAvailableModels}
                disabled={isLoadingModels || !apiKey}
              >
                Обновить список моделей
              </Button>
            </>
          )}
        </TabPanel>
        
        <TabPanel value={tabValue} index={2}>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Системный промпт определяет задачу, которую должен выполнять ИИ при анализе переписки.
            Вы можете настроить его под свои потребности.
          </Typography>
          
          <TextField
            margin="dense"
            label="Системный промпт"
            multiline
            rows={10}
            fullWidth
            variant="outlined"
            value={systemPrompt}
            onChange={(e) => setSystemPromptState(e.target.value)}
            InputProps={{
              sx: {
                ...(isDarkMode && {
                  backgroundColor: 'rgba(255, 255, 255, 0.05)'
                })
              }
            }}
          />
          
          <Button 
            variant="outlined" 
            color="secondary" 
            sx={{ mt: 2 }} 
            onClick={handleResetSystemPrompt}
          >
            Сбросить к значению по умолчанию
          </Button>
        </TabPanel>
        
        <TabPanel value={tabValue} index={3}>
          <SecurityContent />
        </TabPanel>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Отмена</Button>
        <Button 
          onClick={handleSave}
          disabled={!apiKey.trim()}
          variant="contained"
        >
          Сохранить
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Settings; 