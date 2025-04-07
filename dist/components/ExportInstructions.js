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
const ExpandMore_1 = __importDefault(require("@mui/icons-material/ExpandMore"));
const Numbers_1 = __importDefault(require("@mui/icons-material/Numbers"));
const CloudUpload_1 = __importDefault(require("@mui/icons-material/CloudUpload"));
const Memory_1 = __importDefault(require("@mui/icons-material/Memory"));
const LinkOff_1 = __importDefault(require("@mui/icons-material/LinkOff"));
const DeleteForever_1 = __importDefault(require("@mui/icons-material/DeleteForever"));
const OpenInNew_1 = __importDefault(require("@mui/icons-material/OpenInNew"));
const ExportInstructions = () => {
    const [expandedExport, setExpandedExport] = (0, react_1.useState)(false);
    const [expandedSecurity, setExpandedSecurity] = (0, react_1.useState)(false);
    const theme = (0, material_1.useTheme)();
    const isDarkMode = theme.palette.mode === 'dark';
    const handleExportChange = () => {
        setExpandedExport(!expandedExport);
    };
    const handleSecurityChange = () => {
        setExpandedSecurity(!expandedSecurity);
    };
    return (<>
      <material_1.Accordion expanded={expandedExport} onChange={handleExportChange} sx={{
            mb: 2,
            ...(isDarkMode && {
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                backgroundImage: 'none'
            })
        }}>
        <material_1.AccordionSummary expandIcon={<ExpandMore_1.default />} aria-controls="export-instructions-content" id="export-instructions-header" sx={{
            ...(isDarkMode && {
                '&.Mui-expanded': {
                    backgroundColor: 'rgba(0, 0, 0, 0.2)'
                }
            })
        }}>
          <material_1.Typography>Как экспортировать чат из Telegram Desktop</material_1.Typography>
        </material_1.AccordionSummary>
        <material_1.AccordionDetails>
          <material_1.Box sx={{ mb: 2 }}>
            <material_1.Typography variant="body1" gutterBottom>
              Чтобы проанализировать переписку, необходимо экспортировать чат из Telegram Desktop:
            </material_1.Typography>
          </material_1.Box>
          
          <material_1.List sx={{
            ...(isDarkMode && {
                bgcolor: 'rgba(0, 0, 0, 0.2)',
                borderRadius: 1,
                p: 1
            })
        }}>
            <material_1.ListItem>
              <material_1.ListItemIcon><Numbers_1.default color="primary"/></material_1.ListItemIcon>
              <material_1.ListItemText primary="Откройте приложение Telegram Desktop на компьютере" secondary="Экспорт доступен только в десктопной версии мессенджера" secondaryTypographyProps={{
            color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary'
        }}/>
            </material_1.ListItem>
            
            <material_1.ListItem>
              <material_1.ListItemIcon><Numbers_1.default color="primary"/></material_1.ListItemIcon>
              <material_1.ListItemText primary="Откройте нужный чат или диалог" secondary="Выберите личную переписку, которую хотите проанализировать" secondaryTypographyProps={{
            color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary'
        }}/>
            </material_1.ListItem>
            
            <material_1.ListItem>
              <material_1.ListItemIcon><Numbers_1.default color="primary"/></material_1.ListItemIcon>
              <material_1.ListItemText primary="Нажмите на три точки в правом верхнем углу" secondary="Это откроет меню диалога" secondaryTypographyProps={{
            color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary'
        }}/>
            </material_1.ListItem>
            
            <material_1.ListItem>
              <material_1.ListItemIcon><Numbers_1.default color="primary"/></material_1.ListItemIcon>
              <material_1.ListItemText primary="Выберите 'Экспортировать чат'" secondary="В некоторых версиях это может называться 'Export chat history'" secondaryTypographyProps={{
            color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary'
        }}/>
            </material_1.ListItem>
            
            <material_1.ListItem>
              <material_1.ListItemIcon><Numbers_1.default color="primary"/></material_1.ListItemIcon>
              <material_1.ListItemText primary="В настройках экспорта выберите формат HTML или JSON" secondary="Оба формата поддерживаются приложением для анализа" secondaryTypographyProps={{
            color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary'
        }}/>
            </material_1.ListItem>
            
            <material_1.ListItem>
              <material_1.ListItemIcon><Numbers_1.default color="primary"/></material_1.ListItemIcon>
              <material_1.ListItemText primary="Нажмите 'Экспортировать' и сохраните файл" secondary="После сохранения вы сможете загрузить файл (или несколько файлов) в это приложение" secondaryTypographyProps={{
            color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary'
        }}/>
            </material_1.ListItem>
          </material_1.List>
          
          <material_1.Box sx={{
            mt: 2,
            bgcolor: isDarkMode ? 'rgba(33, 150, 243, 0.1)' : 'rgba(33, 150, 243, 0.05)',
            color: isDarkMode ? theme.palette.text.primary : theme.palette.text.primary,
            p: 2,
            borderRadius: 1
        }}>
            <material_1.Typography variant="body2">
              После экспорта вы получите файл (один или несколько файлов) HTML или JSON, который можно загрузить в приложение 
              для анализа. Приложение извлечет текст сообщений и проанализирует их содержимое 
              с помощью нейросети.
            </material_1.Typography>
          </material_1.Box>
        </material_1.AccordionDetails>
      </material_1.Accordion>

      <material_1.Accordion expanded={expandedSecurity} onChange={handleSecurityChange} sx={{
            mb: 3,
            ...(isDarkMode && {
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                backgroundImage: 'none'
            })
        }}>
        <material_1.AccordionSummary expandIcon={<ExpandMore_1.default />} aria-controls="security-info-content" id="security-info-header" sx={{
            ...(isDarkMode && {
                '&.Mui-expanded': {
                    backgroundColor: 'rgba(0, 0, 0, 0.2)'
                }
            })
        }}>
          <material_1.Typography>Безопасность вашей информации</material_1.Typography>
        </material_1.AccordionSummary>
        <material_1.AccordionDetails>
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
              <material_1.ListItemText primary="Загрузка данных" secondary="Ваши чаты загружаются только в браузер и обрабатываются локально. Мы не сохраняем ваши переписки на наших серверах." secondaryTypographyProps={{
            color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary'
        }}/>
            </material_1.ListItem>
            
            <material_1.ListItem>
              <material_1.ListItemIcon>
                <Memory_1.default color="primary"/>
              </material_1.ListItemIcon>
              <material_1.ListItemText primary="Анализ искусственным интеллектом" secondary="Для анализа ваших чатов мы используем API Google Gemini. Текст отправляется в Google для обработки согласно их политике конфиденциальности." secondaryTypographyProps={{
            color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary'
        }}/>
            </material_1.ListItem>
            
            <material_1.ListItem>
              <material_1.ListItemIcon>
                <LinkOff_1.default color="primary"/>
              </material_1.ListItemIcon>
              <material_1.ListItemText primary="Политика Google Gemini" secondary="Подробную информацию о том, как Google обрабатывает данные, можно найти в документации Google Gemini." secondaryTypographyProps={{
            color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary'
        }}/>
            </material_1.ListItem>
            
            <material_1.ListItem>
              <material_1.ListItemIcon>
                <DeleteForever_1.default color="primary"/>
              </material_1.ListItemIcon>
              <material_1.ListItemText primary="Удаление данных" secondary="Вы можете в любой момент удалить всю информацию, нажав кнопку 'Забыть всё'. Все данные хранятся только локально в вашем браузере." secondaryTypographyProps={{
            color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary'
        }}/>
            </material_1.ListItem>
          </material_1.List>
          
          <material_1.Box sx={{
            mt: 3,
            bgcolor: isDarkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(25, 118, 210, 0.08)',
            p: 2,
            borderRadius: 1
        }}>
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
        </material_1.AccordionDetails>
      </material_1.Accordion>
    </>);
};
exports.default = ExportInstructions;
