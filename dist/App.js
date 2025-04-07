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
const Settings_1 = __importDefault(require("@mui/icons-material/Settings"));
const Brightness4_1 = __importDefault(require("@mui/icons-material/Brightness4"));
const Brightness7_1 = __importDefault(require("@mui/icons-material/Brightness7"));
const DeleteForever_1 = __importDefault(require("@mui/icons-material/DeleteForever"));
const ExportInstructions_1 = __importDefault(require("./components/ExportInstructions"));
const FileUpload_1 = __importDefault(require("./components/FileUpload"));
const Chat_1 = __importDefault(require("./components/Chat"));
const Settings_2 = __importDefault(require("./components/Settings"));
const geminiService_1 = require("./services/geminiService");
const ThemeContext_1 = require("./contexts/ThemeContext");
const ThemeContext_2 = require("./contexts/ThemeContext");
const theme_1 = require("./theme");
// Компонент оболочки с доступом к ThemeContext
const AppWithTheme = () => {
    const { mode, toggleTheme } = (0, ThemeContext_2.useThemeContext)();
    const theme = (0, theme_1.getTheme)(mode);
    const isDarkMode = mode === 'dark';
    const [analysisResult, setAnalysisResult] = (0, react_1.useState)(null);
    const [isSettingsOpen, setIsSettingsOpen] = (0, react_1.useState)(false);
    const [forceUpdate, setForceUpdate] = (0, react_1.useState)(0);
    const [isResetDialogOpen, setIsResetDialogOpen] = (0, react_1.useState)(false);
    const [showResetConfirmation, setShowResetConfirmation] = (0, react_1.useState)(false);
    // Эффект для проверки ключа при первом запуске
    (0, react_1.useEffect)(() => {
        if (!(0, geminiService_1.hasApiKey)()) {
            setIsSettingsOpen(true);
        }
    }, []);
    // Эффект для автоматического закрытия уведомления
    (0, react_1.useEffect)(() => {
        if (showResetConfirmation) {
            const timer = setTimeout(() => {
                setShowResetConfirmation(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showResetConfirmation]);
    const handleAnalysisComplete = (result) => {
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
    return (<material_1.ThemeProvider theme={theme}>
      <material_1.CssBaseline />
      
      {/* Сообщение об успешной очистке данных */}
      <material_1.Dialog open={showResetConfirmation} hideBackdrop={false} disableEscapeKeyDown={false} PaperProps={{
            sx: {
                backgroundColor: 'transparent',
                boxShadow: 'none',
                maxWidth: '90%',
                margin: 0
            }
        }} onClose={handleCloseSnackbar}>
        <material_1.Box sx={{
            backgroundColor: mode === 'light' ? 'rgba(56, 142, 60, 0.9)' : '#43a047',
            color: '#fff',
            fontSize: '1.2rem',
            padding: '16px 24px',
            borderRadius: '8px',
            textAlign: 'center',
            boxShadow: 3
        }}>
          Все ваши личные данные успешно удалены
        </material_1.Box>
      </material_1.Dialog>
      
      <material_1.Container maxWidth="md">
        <material_1.Paper elevation={3} sx={{
            my: 4,
            p: 3,
            borderRadius: 2,
            display: 'flex',
            flexDirection: 'column'
        }}>
          <material_1.Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <material_1.Typography variant="h4" component="h1" gutterBottom sx={{ mb: 0, display: 'flex', alignItems: 'center' }}>
              <material_1.Box component="img" src={`${process.env.PUBLIC_URL}/logo_flover_bubble.png`} alt="ЛюБит / Не люБит" sx={{
            mr: 1,
            width: '72px',
            height: '72px',
        }}/>
              <material_1.Box component="span" sx={{ color: mode === 'dark' ? '#ffffff' : 'primary.main' }}>ЛюБит</material_1.Box>
              <material_1.Box component="span" sx={{ color: 'secondary.main' }}> / </material_1.Box>
              <material_1.Box component="span" sx={{ color: mode === 'dark' ? '#ffffff' : 'primary.main' }}>Не люБит</material_1.Box>
            </material_1.Typography>
            <material_1.Box sx={{ display: 'flex', gap: 1 }}>
              <material_1.Tooltip title={mode === 'light' ? "Включить тёмную тему" : "Включить светлую тему"}>
                <material_1.IconButton onClick={toggleTheme} color="inherit">
                  {mode === 'light' ? <Brightness4_1.default /> : <Brightness7_1.default />}
                </material_1.IconButton>
              </material_1.Tooltip>
              <material_1.Tooltip title="Настройки приложения">
                <material_1.IconButton color={(0, geminiService_1.hasApiKey)() ? "primary" : "error"} onClick={handleOpenSettings} size="large">
                  <Settings_1.default />
                </material_1.IconButton>
              </material_1.Tooltip>
            </material_1.Box>
          </material_1.Box>
          
          <material_1.Typography variant="body1" component="h1" gutterBottom sx={{ mb: 4 }}>
            Анализ переписки между людьми в Telegram с помощью нейросети
          </material_1.Typography>

          {!(0, geminiService_1.hasApiKey)() && (<material_1.Alert severity="warning" sx={{ mb: 3 }}>
              Для работы приложения необходимо добавить API ключ Gemini в настройках.
            </material_1.Alert>)}

          {!analysisResult ? (<>
              <ExportInstructions_1.default />
              <FileUpload_1.default key={`upload-${forceUpdate}`} onAnalysisComplete={handleAnalysisComplete}/>
              
              {/* Кнопка "Забыть всё" в режиме загрузки */}
              <material_1.Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <material_1.Button variant="outlined" color="error" startIcon={<DeleteForever_1.default />} onClick={handleOpenResetDialog} sx={{
                borderRadius: 2,
                py: 1,
                px: 3,
                fontSize: '0.9rem',
                ...(isDarkMode && {
                    borderColor: 'rgba(211, 47, 47, 0.5)',
                    color: '#f44336'
                })
            }}>
                  Забыть всё
                </material_1.Button>
              </material_1.Box>
            </>) : (<material_1.Box sx={{ mt: 3 }}>
              <Chat_1.default key={`chat-${forceUpdate}`} initialAnalysis={analysisResult}/>
              
              {/* Кнопка "Забыть всё" в режиме чата */}
              <material_1.Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <material_1.Button variant="contained" color="error" startIcon={<DeleteForever_1.default />} onClick={handleOpenResetDialog} sx={{
                borderRadius: 2,
                py: 1,
                px: 3,
                fontSize: '0.9rem'
            }}>
                  Забыть всё
                </material_1.Button>
              </material_1.Box>
            </material_1.Box>)}
        </material_1.Paper>

        {/* Компонент настроек */}
        <Settings_2.default open={isSettingsOpen} onClose={handleCloseSettings} onSave={handleSettingsSave}/>

        {/* Диалог подтверждения сброса данных */}
        <material_1.Dialog open={isResetDialogOpen} onClose={handleCloseResetDialog} PaperProps={{
            sx: {
                ...(isDarkMode && {
                    backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))'
                })
            }
        }}>
          <material_1.DialogTitle>Подтверждение сброса данных</material_1.DialogTitle>
          <material_1.DialogContent>
            <material_1.Typography>
              Вы уверены, что хотите удалить все загруженные файлы и историю чата? 
              Это действие нельзя отменить.
            </material_1.Typography>
          </material_1.DialogContent>
          <material_1.DialogActions>
            <material_1.Button onClick={handleCloseResetDialog}>Отмена</material_1.Button>
            <material_1.Button onClick={handleResetAll} color="error" variant="contained" startIcon={<DeleteForever_1.default />}>
              Забыть всё
            </material_1.Button>
          </material_1.DialogActions>
        </material_1.Dialog>
      </material_1.Container>
    </material_1.ThemeProvider>);
};
// Корневой компонент с ThemeProvider
function App() {
    return (<ThemeContext_1.ThemeProvider>
      <AppWithTheme />
    </ThemeContext_1.ThemeProvider>);
}
exports.default = App;
