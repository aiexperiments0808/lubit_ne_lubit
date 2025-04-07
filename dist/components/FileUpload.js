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
const CloudUpload_1 = __importDefault(require("@mui/icons-material/CloudUpload"));
const Description_1 = __importDefault(require("@mui/icons-material/Description"));
const Delete_1 = __importDefault(require("@mui/icons-material/Delete"));
const styles_1 = require("@mui/material/styles");
const geminiService_1 = require("../services/geminiService");
const chatAnalyzer_1 = require("../services/chatAnalyzer");
const ChatStatistics_1 = __importDefault(require("./ChatStatistics"));
const UploadBox = (0, styles_1.styled)(material_1.Box, {
    shouldForwardProp: (prop) => prop !== 'isDragging' && prop !== 'isDarkMode',
})(({ isDragging, isDarkMode, theme }) => ({
    border: `2px dashed ${isDarkMode
        ? isDragging ? theme.palette.primary.main : 'rgba(255, 255, 255, 0.3)'
        : isDragging ? theme.palette.primary.dark : theme.palette.primary.main}`,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(4),
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    backgroundColor: isDarkMode
        ? isDragging ? 'rgba(33, 150, 243, 0.08)' : 'rgba(255, 255, 255, 0.05)'
        : isDragging ? theme.palette.action.hover : theme.palette.background.paper,
    marginTop: theme.spacing(3),
    '&:hover': {
        borderColor: theme.palette.primary.main,
        backgroundColor: isDarkMode
            ? 'rgba(33, 150, 243, 0.08)'
            : theme.palette.action.hover,
    },
}));
const FileUpload = ({ onAnalysisComplete }) => {
    const theme = (0, material_1.useTheme)();
    const isDarkMode = theme.palette.mode === 'dark';
    const [isDragging, setIsDragging] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const [processedFiles, setProcessedFiles] = (0, react_1.useState)([]);
    const fileInputRef = (0, react_1.useRef)(null);
    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };
    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };
    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };
    const validateFile = (file) => {
        // Проверка типа файла
        const allowedTypes = ['application/json', 'text/html'];
        const allowedExtensions = ['.json', '.html'];
        const hasValidExtension = allowedExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
        if (!allowedTypes.includes(file.type) && !hasValidExtension) {
            return false;
        }
        // Проверка размера файла (не более 10 МБ)
        const maxSize = 10 * 1024 * 1024; // 10 МБ в байтах
        if (file.size > maxSize) {
            return false;
        }
        return true;
    };
    const extractChatContent = async (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                var _a;
                try {
                    const content = (_a = event.target) === null || _a === void 0 ? void 0 : _a.result;
                    if (file.name.endsWith('.json')) {
                        try {
                            // Анализируем JSON файл
                            const analyzer = new chatAnalyzer_1.ChatAnalyzer(content);
                            const statistics = analyzer.analyze();
                            // Извлекаем сообщения как раньше
                            const jsonData = JSON.parse(content);
                            const messages = jsonData.messages
                                .map((msg) => {
                                const from = msg.from || 'Unknown';
                                const date = msg.date || '';
                                const text = Array.isArray(msg.text)
                                    ? msg.text.map((t) => (typeof t === 'string' ? t : t.text)).join('')
                                    : msg.text || '';
                                return `${from} (${date}): ${text}`;
                            })
                                .join('\n');
                            resolve({ content: messages, statistics });
                        }
                        catch (e) {
                            reject(new Error('Ошибка при парсинге JSON'));
                        }
                    }
                    else if (file.name.endsWith('.html')) {
                        // Для HTML файлов оставляем старую логику
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(content, 'text/html');
                        const messages = Array.from(doc.querySelectorAll('.message')).map(msg => {
                            var _a, _b, _c;
                            const from = ((_a = msg.querySelector('.from_name')) === null || _a === void 0 ? void 0 : _a.textContent) || 'Unknown';
                            const text = ((_b = msg.querySelector('.text')) === null || _b === void 0 ? void 0 : _b.textContent) || '';
                            const date = ((_c = msg.querySelector('.date')) === null || _c === void 0 ? void 0 : _c.textContent) || '';
                            return `${from} (${date}): ${text}`;
                        }).join('\n');
                        resolve({ content: messages });
                    }
                    else {
                        reject(new Error('Неподдерживаемый формат файла'));
                    }
                }
                catch (error) {
                    reject(error);
                }
            };
            reader.onerror = () => {
                reject(new Error('Ошибка при чтении файла'));
            };
            reader.readAsText(file);
        });
    };
    const processFiles = async (files) => {
        // Проверяем наличие API ключа
        if (!(0, geminiService_1.hasApiKey)()) {
            setError('Необходимо добавить API ключ Gemini в настройках');
            return;
        }
        setIsLoading(true);
        setError(null);
        const invalidFiles = [];
        const validFiles = [];
        // Проверяем все файлы на валидность
        for (const file of files) {
            if (validateFile(file)) {
                validFiles.push(file);
            }
            else {
                invalidFiles.push(file.name);
            }
        }
        // Если есть невалидные файлы, выводим предупреждение
        if (invalidFiles.length > 0) {
            console.warn('Некоторые файлы были пропущены из-за неподдерживаемого формата или размера:', invalidFiles);
        }
        // Если нет валидных файлов, прекращаем обработку
        if (validFiles.length === 0) {
            setError('Нет подходящих файлов для обработки. Поддерживаются только файлы .html и .json размером до 10 МБ.');
            setIsLoading(false);
            return;
        }
        try {
            // Обрабатываем каждый файл
            const processedContents = [];
            for (const file of validFiles) {
                try {
                    const { content, statistics } = await extractChatContent(file);
                    // Если контент слишком короткий, пропускаем файл
                    if (content.length < 100) {
                        invalidFiles.push(file.name + ' (слишком короткий контент)');
                        continue;
                    }
                    processedContents.push({
                        name: file.name,
                        content,
                        statistics
                    });
                }
                catch (fileError) {
                    console.error(`Ошибка при обработке файла ${file.name}:`, fileError);
                    invalidFiles.push(file.name + ' (ошибка обработки)');
                }
            }
            // Если ни один файл не был обработан успешно
            if (processedContents.length === 0) {
                throw new Error('Не удалось обработать ни один из предоставленных файлов.');
            }
            // Сохраняем обработанные файлы в состоянии
            setProcessedFiles(processedContents);
            // Анализируем контент всех файлов
            const analysis = await (0, geminiService_1.analyzeMultipleChats)(processedContents.map(file => file.content));
            onAnalysisComplete(analysis);
        }
        catch (error) {
            console.error('Ошибка при обработке файлов:', error);
            setError(error instanceof Error ? error.message : 'Произошла неизвестная ошибка');
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const filesArray = Array.from(e.dataTransfer.files);
            processFiles(filesArray);
        }
    };
    const handleFileInputChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const filesArray = Array.from(e.target.files);
            processFiles(filesArray);
        }
    };
    const handleClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };
    const handleButtonClick = (e) => {
        e.stopPropagation();
        handleClick();
    };
    const handleRemoveFile = (index) => {
        const newFiles = [...processedFiles];
        newFiles.splice(index, 1);
        setProcessedFiles(newFiles);
        // Если файлов не осталось, очищаем состояние
        if (newFiles.length === 0) {
            fileInputRef.current.value = '';
        }
    };
    const handleAnalyze = async () => {
        if (processedFiles.length === 0) {
            setError('Нет файлов для анализа');
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const analysis = await (0, geminiService_1.analyzeMultipleChats)(processedFiles.map(file => file.content));
            onAnalysisComplete(analysis);
        }
        catch (error) {
            console.error('Ошибка при анализе файлов:', error);
            setError(error instanceof Error ? error.message : 'Произошла неизвестная ошибка');
        }
        finally {
            setIsLoading(false);
        }
    };
    return (<material_1.Box sx={{ my: 3 }}>
      {!(0, geminiService_1.hasApiKey)() && (<material_1.Alert severity="warning" sx={{
                mb: 2,
                ...(isDarkMode && {
                    backgroundColor: 'rgba(255, 152, 0, 0.1)',
                    color: 'warning.light'
                })
            }}>
          <material_1.AlertTitle>Требуется API ключ</material_1.AlertTitle>
          Пожалуйста, добавьте API ключ Gemini, нажав на кнопку настроек вверху страницы.
        </material_1.Alert>)}
      
      <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept=".html,.json" onChange={handleFileInputChange} multiple/>
      
      {processedFiles.length > 0 ? (<material_1.Box sx={{ mb: 3, mt: 2 }}>
          <material_1.Typography variant="h6" sx={{ mb: 1 }}>
            Загруженные файлы ({processedFiles.length})
          </material_1.Typography>
          
          {/* Отображаем статистику для каждого JSON файла */}
          {processedFiles.map((file, index) => (<material_1.Box key={index}>
              <material_1.List sx={{
                    bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'background.paper',
                    borderRadius: 1,
                    mb: 2
                }}>
                <material_1.ListItem secondaryAction={<material_1.Button size="small" color="error" onClick={() => handleRemoveFile(index)} startIcon={<Delete_1.default />}>
                      Удалить
                    </material_1.Button>}>
                  <material_1.ListItemIcon>
                    <Description_1.default color="primary"/>
                  </material_1.ListItemIcon>
                  <material_1.ListItemText primary={file.name} secondary={`${Math.round(file.content.length / 100) / 10} KB`}/>
                </material_1.ListItem>
              </material_1.List>
              
              {/* Показываем статистику только для JSON файлов */}
              {file.statistics && (<ChatStatistics_1.default statistics={file.statistics}/>)}
            </material_1.Box>))}
          
          <material_1.Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between' }}>
            <material_1.Button variant="outlined" onClick={handleClick} startIcon={<CloudUpload_1.default />} disabled={isLoading}>
              Добавить ещё файлы
            </material_1.Button>
            
            <material_1.Button variant="contained" color="primary" onClick={handleAnalyze} disabled={isLoading || processedFiles.length === 0}>
              {isLoading ? 'Анализ...' : 'Анализировать все файлы'}
            </material_1.Button>
          </material_1.Box>
        </material_1.Box>) : (<UploadBox isDragging={isDragging} isDarkMode={isDarkMode} onDragEnter={handleDragEnter} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} onClick={handleClick}>
          <CloudUpload_1.default sx={{ fontSize: 48, color: 'primary.main', mb: 2 }}/>
          <material_1.Typography variant="h6" gutterBottom>
            Перетащите файлы сюда или нажмите для выбора
          </material_1.Typography>
          <material_1.Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Поддерживаемые форматы: HTML, JSON (экспорт из Telegram)
          </material_1.Typography>
          <material_1.Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Максимальный размер файла: 10 МБ
          </material_1.Typography>
          <material_1.Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Можно загрузить несколько файлов одновременно
          </material_1.Typography>
          <material_1.Button variant="contained" startIcon={<CloudUpload_1.default />} onClick={handleButtonClick} disabled={isLoading}>
            Выбрать файлы
          </material_1.Button>
        </UploadBox>)}
      
      {isLoading && (<material_1.Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                my: 3,
                gap: 2
            }}>
          <material_1.CircularProgress size={40}/>
          <material_1.Typography variant="body2" color="text.secondary">
            Анализируем ваши данные...
          </material_1.Typography>
        </material_1.Box>)}
      
      {error && (<material_1.Alert severity="error" sx={{
                mt: 2,
                ...(isDarkMode && {
                    backgroundColor: 'rgba(211, 47, 47, 0.1)',
                    color: 'error.light'
                })
            }}>
          <material_1.AlertTitle>Ошибка</material_1.AlertTitle>
          {error}
        </material_1.Alert>)}
    </material_1.Box>);
};
exports.default = FileUpload;
