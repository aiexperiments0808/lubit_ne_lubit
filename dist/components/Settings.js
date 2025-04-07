"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const material_1 = require("@mui/material");
const InfoOutlined_1 = __importDefault(require("@mui/icons-material/InfoOutlined"));
const geminiService_1 = require("../services/geminiService");
const CloudUpload_1 = __importDefault(require("@mui/icons-material/CloudUpload"));
const Memory_1 = __importDefault(require("@mui/icons-material/Memory"));
const LinkOff_1 = __importDefault(require("@mui/icons-material/LinkOff"));
const DeleteForever_1 = __importDefault(require("@mui/icons-material/DeleteForever"));
const OpenInNew_1 = __importDefault(require("@mui/icons-material/OpenInNew"));
// Информация о моделях для отображения
const MODEL_INFO = {
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
function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (<div role="tabpanel" hidden={value !== index} id={`settings-tabpanel-${index}`} aria-labelledby={`settings-tab-${index}`} {...other}>
      {value === index && (<material_1.Box sx={{ pt: 3 }}>
          {children}
        </material_1.Box>)}
    </div>);
}
function a11yProps(index) {
    return {
        id: `settings-tab-${index}`,
        'aria-controls': `settings-tabpanel-${index}`,
    };
}
// Функция для отображения содержимого вкладки безопасности
function SecurityContent() {
    const theme = (0, material_1.useTheme)();
    const isDarkMode = theme.palette.mode === 'dark';
    return (<material_1.Box sx={{ p: 2 }}>
      <material_1.Typography variant="h6" gutterBottom>
        Безопасность вашей информации
      </material_1.Typography>
      
      <material_1.Typography paragraph>
        Мы заботимся о безопасности ваших данных. Вот как наше приложение обрабатывает вашу информацию:
      </material_1.Typography>
      
      <material_1.List disablePadding sx={{
            bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
            borderRadius: 1,
            mt: 2
        }}>
        <material_1.ListItem>
          <material_1.ListItemIcon>
            <CloudUpload_1.default color="primary"/>
          </material_1.ListItemIcon>
          <material_1.ListItemText primary="Загрузка данных" secondary="Ваши чаты загружаются только в браузер и обрабатываются локально. Мы не сохраняем ваши переписки на наших серверах."/>
        </material_1.ListItem>
        
        <material_1.ListItem>
          <material_1.ListItemIcon>
            <Memory_1.default color="primary"/>
          </material_1.ListItemIcon>
          <material_1.ListItemText primary="Анализ искусственным интеллектом" secondary="Для анализа ваших чатов мы используем API Google Gemini. Текст отправляется в Google для обработки согласно их политике конфиденциальности."/>
        </material_1.ListItem>
        
        <material_1.ListItem>
          <material_1.ListItemIcon>
            <LinkOff_1.default color="primary"/>
          </material_1.ListItemIcon>
          <material_1.ListItemText primary="Политика Google Gemini" secondary="Подробную информацию о том, как Google обрабатывает данные, можно найти в документации Google Gemini."/>
        </material_1.ListItem>
        
        <material_1.ListItem>
          <material_1.ListItemIcon>
            <DeleteForever_1.default color="primary"/>
          </material_1.ListItemIcon>
          <material_1.ListItemText primary="Удаление данных" secondary="Вы можете в любой момент удалить всю информацию, нажав кнопку 'Забыть всё'. Все данные хранятся только локально в вашем браузере."/>
        </material_1.ListItem>
      </material_1.List>
      
      <material_1.Box sx={{ mt: 3, bgcolor: isDarkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(25, 118, 210, 0.08)', p: 2, borderRadius: 1 }}>
        <material_1.Typography variant="subtitle2" color="primary" gutterBottom>
          Важное замечание:
        </material_1.Typography>
        <material_1.Typography variant="body2">
          Мы рекомендуем не загружать конфиденциальную информацию, такую как пароли, финансовые данные или любую личную информацию, которую вы не хотели бы передавать третьим лицам. Для получения наилучших результатов анализа достаточно текста сообщений.
        </material_1.Typography>
      </material_1.Box>
      
      <material_1.Button component="a" href="https://ai.google.dev/docs/safety_guidance" target="_blank" rel="noopener noreferrer" variant="outlined" startIcon={<OpenInNew_1.default />} sx={{ mt: 3 }}>
        Политика Google Gemini
      </material_1.Button>
    </material_1.Box>);
}
const Settings = ({ open, onClose, onSave }) => {
    const theme = (0, material_1.useTheme)();
    const isDarkMode = theme.palette.mode === 'dark';
    const [apiKey, setApiKeyState] = (0, react_1.useState)((0, geminiService_1.getApiKey)());
    const [systemPrompt, setSystemPromptState] = (0, react_1.useState)((0, geminiService_1.getSystemPrompt)());
    const [modelName, setModelNameState] = (0, react_1.useState)((0, geminiService_1.getModelName)());
    const [tabValue, setTabValue] = (0, react_1.useState)(0);
    const [availableModels, setAvailableModels] = (0, react_1.useState)([]);
    const [isLoadingModels, setIsLoadingModels] = (0, react_1.useState)(false);
    const [modelError, setModelError] = (0, react_1.useState)(null);
    // Мемоизируем функцию loadAvailableModels с useCallback
    const loadAvailableModels = (0, react_1.useCallback)(async () => {
        if (!apiKey)
            return;
        setIsLoadingModels(true);
        setModelError(null);
        try {
            const models = await (0, geminiService_1.listAvailableModels)();
            setAvailableModels(models);
        }
        catch (error) {
            setModelError(error.message);
            console.error('Ошибка при получении списка моделей:', error);
        }
        finally {
            setIsLoadingModels(false);
        }
    }, [apiKey]);
    (0, react_1.useEffect)(() => {
        if (open && apiKey) {
            loadAvailableModels();
        }
    }, [open, apiKey, loadAvailableModels]);
    const handleTabChange = (_event, newValue) => {
        setTabValue(newValue);
    };
    const handleClose = () => {
        onClose();
    };
    const handleSave = () => {
        (0, geminiService_1.setApiKey)(apiKey.trim());
        (0, geminiService_1.setSystemPrompt)(systemPrompt);
        (0, geminiService_1.setModelName)(modelName);
        onSave();
        onClose();
    };
    const handleModelChange = (event) => {
        setModelNameState(event.target.value);
    };
    const handleResetSystemPrompt = () => {
        // Сбрасываем к значению по умолчанию
        setSystemPromptState((0, geminiService_1.getSystemPrompt)(true));
    };
    // Получение описания модели
    const getModelDescription = (model) => {
        const baseModelName = model.replace(/^models\//, '');
        // Ищем совпадение по имени или префиксу модели
        const infoKey = Object.keys(MODEL_INFO).find(key => baseModelName === key || baseModelName.startsWith(key + '-'));
        return infoKey ? MODEL_INFO[infoKey].description : '';
    };
    // Проверка, рекомендуется ли модель
    const isRecommendedModel = (model) => {
        const baseModelName = model.replace(/^models\//, '');
        const infoKey = Object.keys(MODEL_INFO).find(key => baseModelName === key || baseModelName.startsWith(key + '-'));
        return infoKey ? MODEL_INFO[infoKey].recommended : false;
    };
    return (<material_1.Dialog open={open} onClose={handleClose} fullWidth maxWidth="md" PaperProps={{
            sx: {
                ...(isDarkMode && {
                    backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))'
                })
            }
        }}>
      <material_1.DialogTitle>Настройки приложения</material_1.DialogTitle>
      <material_1.DialogContent>
        <material_1.Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <material_1.Tabs value={tabValue} onChange={handleTabChange} aria-label="Настройки" sx={{
            '& .MuiTabs-indicator': {
                backgroundColor: theme.palette.primary.main,
            },
            '& .MuiTab-root': {
                color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : undefined,
                '&.Mui-selected': {
                    color: theme.palette.primary.main,
                },
            },
        }}>
            <material_1.Tab label="API ключ" {...a11yProps(0)}/>
            <material_1.Tab label="Модель" {...a11yProps(1)}/>
            <material_1.Tab label="Системный промпт" {...a11yProps(2)}/>
            <material_1.Tab label="Безопасность" {...a11yProps(3)}/>
          </material_1.Tabs>
        </material_1.Box>
        
        <TabPanel value={tabValue} index={0}>
          <material_1.Typography variant="body2" sx={{ mb: 2 }}>
            Для работы приложения необходим API ключ от Gemini AI. 
            Получить его можно на сайте{' '}
            <material_1.Link href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" sx={{ color: isDarkMode ? theme.palette.primary.light : undefined }}>
              Google AI Studio
            </material_1.Link>.
          </material_1.Typography>
          <material_1.Alert severity="info" sx={{
            mb: 2,
            ...(isDarkMode && {
                backgroundColor: 'rgba(33, 150, 243, 0.1)',
                color: theme.palette.primary.light
            })
        }}>
            Рекомендуется использовать модель <strong>gemini-2.0-flash</strong> или <strong>gemini-1.5-pro</strong>.
            Убедитесь, что ваш API ключ имеет доступ к этим моделям.
          </material_1.Alert>
          <material_1.TextField autoFocus margin="dense" label="API ключ" type="text" fullWidth variant="outlined" value={apiKey} onChange={(e) => setApiKeyState(e.target.value)} InputProps={{
            sx: {
                ...(isDarkMode && {
                    backgroundColor: 'rgba(255, 255, 255, 0.05)'
                })
            }
        }}/>
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          {!apiKey ? (<material_1.Alert severity="warning" sx={{
                mb: 2,
                ...(isDarkMode && {
                    backgroundColor: 'rgba(255, 152, 0, 0.1)',
                    color: 'warning.light'
                })
            }}>
              Сначала необходимо добавить API ключ в соответствующей вкладке.
            </material_1.Alert>) : (<>
              <material_1.Typography variant="body2" sx={{ mb: 2 }}>
                Выберите модель Gemini, которая будет использоваться для анализа переписки.
              </material_1.Typography>
              
              <material_1.FormControl fullWidth sx={{
                mt: 2,
                '& .MuiOutlinedInput-root': {
                    ...(isDarkMode && {
                        backgroundColor: 'rgba(255, 255, 255, 0.05)'
                    })
                }
            }}>
                <material_1.InputLabel id="model-select-label">Модель</material_1.InputLabel>
                <material_1.Select labelId="model-select-label" value={modelName} label="Модель" onChange={handleModelChange} disabled={isLoadingModels}>
                  {isLoadingModels ? (<material_1.MenuItem value="">
                      <material_1.Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <material_1.CircularProgress size={20}/>
                        <span>Загрузка моделей...</span>
                      </material_1.Box>
                    </material_1.MenuItem>) : (availableModels.map((model) => {
                const displayName = model.replace(/^models\//, '');
                const description = getModelDescription(model);
                const isRecommended = isRecommendedModel(model);
                return (<material_1.MenuItem key={model} value={model} sx={{
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        ...(isRecommended && {
                            backgroundColor: isDarkMode
                                ? 'rgba(33, 150, 243, 0.08)'
                                : 'rgba(33, 150, 243, 0.05)',
                        })
                    }}>
                          <material_1.Box sx={{
                        display: 'flex',
                        width: '100%',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                            <material_1.Typography fontWeight={isRecommended ? 'bold' : 'normal'}>
                              {displayName}
                              {isRecommended && ' (рекомендуется)'}
                            </material_1.Typography>
                            
                            {description && (<material_1.Tooltip title={description} arrow placement="right">
                                <InfoOutlined_1.default fontSize="small" sx={{ ml: 1, opacity: 0.7 }}/>
                              </material_1.Tooltip>)}
                          </material_1.Box>
                          
                          {description && (<material_1.Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                              {description}
                            </material_1.Typography>)}
                        </material_1.MenuItem>);
            }))}
                </material_1.Select>
              </material_1.FormControl>
              
              {modelError && (<material_1.Alert severity="error" sx={{
                    mt: 2,
                    ...(isDarkMode && {
                        backgroundColor: 'rgba(211, 47, 47, 0.15)',
                        color: '#f44336'
                    })
                }}>
                  Ошибка при загрузке списка моделей: {modelError}
                </material_1.Alert>)}
              
              <material_1.Button variant="outlined" sx={{ mt: 2 }} onClick={loadAvailableModels} disabled={isLoadingModels || !apiKey}>
                Обновить список моделей
              </material_1.Button>
            </>)}
        </TabPanel>
        
        <TabPanel value={tabValue} index={2}>
          <material_1.Typography variant="body2" sx={{ mb: 2 }}>
            Системный промпт определяет задачу, которую должен выполнять ИИ при анализе переписки.
            Вы можете настроить его под свои потребности.
          </material_1.Typography>
          
          <material_1.TextField margin="dense" label="Системный промпт" multiline rows={10} fullWidth variant="outlined" value={systemPrompt} onChange={(e) => setSystemPromptState(e.target.value)} InputProps={{
            sx: {
                ...(isDarkMode && {
                    backgroundColor: 'rgba(255, 255, 255, 0.05)'
                })
            }
        }}/>
          
          <material_1.Button variant="outlined" color="secondary" sx={{ mt: 2 }} onClick={handleResetSystemPrompt}>
            Сбросить к значению по умолчанию
          </material_1.Button>
        </TabPanel>
        
        <TabPanel value={tabValue} index={3}>
          <SecurityContent />
        </TabPanel>
      </material_1.DialogContent>
      <material_1.DialogActions>
        <material_1.Button onClick={handleClose}>Отмена</material_1.Button>
        <material_1.Button onClick={handleSave} disabled={!apiKey.trim()} variant="contained">
          Сохранить
        </material_1.Button>
      </material_1.DialogActions>
    </material_1.Dialog>);
};
exports.default = Settings;
