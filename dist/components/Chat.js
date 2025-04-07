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
const Send_1 = __importDefault(require("@mui/icons-material/Send"));
const ContentCopy_1 = __importDefault(require("@mui/icons-material/ContentCopy"));
const Done_1 = __importDefault(require("@mui/icons-material/Done"));
const react_markdown_1 = __importDefault(require("react-markdown"));
const remark_gfm_1 = __importDefault(require("remark-gfm"));
const geminiService_1 = require("../services/geminiService");
const Chat = ({ initialAnalysis }) => {
    const theme = (0, material_1.useTheme)();
    const isDarkMode = theme.palette.mode === 'dark';
    const [messages, setMessages] = (0, react_1.useState)([
        { role: 'model', parts: initialAnalysis }
    ]);
    const [newMessage, setNewMessage] = (0, react_1.useState)('');
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    const [copiedMessageIndex, setCopiedMessageIndex] = (0, react_1.useState)(null);
    const messagesEndRef = (0, react_1.useRef)(null);
    // Прокрутка вниз при появлении новых сообщений
    (0, react_1.useEffect)(() => {
        scrollToBottom();
    }, [messages]);
    // Сброс статуса "скопировано" через 2 секунды
    (0, react_1.useEffect)(() => {
        if (copiedMessageIndex !== null) {
            const timer = setTimeout(() => {
                setCopiedMessageIndex(null);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [copiedMessageIndex]);
    const scrollToBottom = () => {
        var _a;
        (_a = messagesEndRef.current) === null || _a === void 0 ? void 0 : _a.scrollIntoView({ behavior: 'smooth' });
    };
    const handleSend = async () => {
        if (!newMessage.trim())
            return;
        // Добавляем сообщение пользователя
        const userMessage = { role: 'user', parts: newMessage };
        setMessages(prev => [...prev, userMessage]);
        setNewMessage('');
        setIsLoading(true);
        setError(null);
        try {
            // Отправляем запрос с историей чата
            const response = await (0, geminiService_1.sendMessage)(newMessage, messages);
            // Добавляем ответ модели
            const modelMessage = { role: 'model', parts: response };
            setMessages(prev => [...prev, modelMessage]);
        }
        catch (err) {
            setError(err.message || 'Произошла ошибка при отправке сообщения');
            console.error('Ошибка в чате:', err);
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };
    const copyMessage = (text, index) => {
        navigator.clipboard.writeText(text)
            .then(() => {
            setCopiedMessageIndex(index);
        })
            .catch(err => {
            console.error('Ошибка при копировании текста: ', err);
        });
    };
    return (<material_1.Paper elevation={0} sx={{
            height: '578px',
            display: 'flex',
            flexDirection: 'column',
            border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.12)' : 'none'
        }}>
      {/* Область сообщений */}
      <material_1.Box sx={{
            flexGrow: 1,
            overflowY: 'auto',
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.2)' : '#f5f5f5'
        }}>
        {messages.map((message, index) => (<material_1.Box key={index} sx={{
                alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '80%',
                minWidth: '40%',
                position: 'relative'
            }}>
            <material_1.Paper elevation={1} sx={{
                p: 2,
                pr: 3,
                borderRadius: 2,
                backgroundColor: message.role === 'user'
                    ? (isDarkMode ? '#1565c0' : '#e3f2fd')
                    : (isDarkMode ? 'rgba(255, 255, 255, 0.05)' : '#fff'),
                color: message.role === 'user' && isDarkMode ? '#fff' : 'inherit',
                position: 'relative',
                // Стили для Markdown контента
                '& .markdown': {
                    '& p': { margin: '0.5em 0' },
                    '& h1, & h2, & h3, & h4, & h5, & h6': {
                        margin: '0.5em 0',
                        fontWeight: 'bold',
                        lineHeight: 1.2
                    },
                    '& h1': { fontSize: '1.4em' },
                    '& h2': { fontSize: '1.3em' },
                    '& h3': { fontSize: '1.2em' },
                    '& h4': { fontSize: '1.1em' },
                    '& h5, & h6': { fontSize: '1em' },
                    '& ul, & ol': { paddingLeft: '1.5em', margin: '0.5em 0' },
                    '& li': { margin: '0.25em 0' },
                    '& a': {
                        color: isDarkMode ? '#90caf9' : '#1976d2',
                        textDecoration: 'underline'
                    },
                    '& blockquote': {
                        borderLeft: isDarkMode
                            ? '4px solid rgba(255, 255, 255, 0.2)'
                            : '4px solid rgba(0, 0, 0, 0.2)',
                        margin: '0.5em 0',
                        padding: '0.5em 0 0.5em 1em',
                        fontStyle: 'italic'
                    },
                    '& code': {
                        backgroundColor: isDarkMode
                            ? 'rgba(255, 255, 255, 0.1)'
                            : 'rgba(0, 0, 0, 0.1)',
                        padding: '0.2em 0.4em',
                        borderRadius: '3px',
                        fontFamily: 'monospace',
                        fontSize: '0.9em'
                    },
                    '& pre': {
                        backgroundColor: isDarkMode
                            ? 'rgba(255, 255, 255, 0.1)'
                            : 'rgba(0, 0, 0, 0.1)',
                        padding: '1em',
                        borderRadius: '4px',
                        overflowX: 'auto',
                        '& code': {
                            backgroundColor: 'transparent',
                            padding: 0
                        }
                    },
                    '& img': {
                        maxWidth: '100%',
                        height: 'auto'
                    },
                    '& table': {
                        borderCollapse: 'collapse',
                        width: '100%',
                        margin: '1em 0'
                    },
                    '& th, & td': {
                        border: isDarkMode
                            ? '1px solid rgba(255, 255, 255, 0.2)'
                            : '1px solid rgba(0, 0, 0, 0.2)',
                        padding: '0.5em'
                    },
                    '& hr': {
                        border: 'none',
                        borderTop: isDarkMode
                            ? '1px solid rgba(255, 255, 255, 0.2)'
                            : '1px solid rgba(0, 0, 0, 0.2)',
                        margin: '1em 0'
                    },
                    '& strong': {
                        fontWeight: 'bold'
                    },
                    '& em': {
                        fontStyle: 'italic'
                    },
                    '& del': {
                        textDecoration: 'line-through'
                    }
                }
            }}>
              {/* Кнопка копирования */}
              <material_1.Tooltip title={copiedMessageIndex === index ? "Скопировано!" : "Копировать"} arrow TransitionComponent={material_1.Fade} TransitionProps={{ timeout: 600 }}>
                <material_1.IconButton size="small" onClick={() => copyMessage(message.parts, index)} color={copiedMessageIndex === index ? "success" : "default"} sx={{
                position: 'absolute',
                bottom: 5,
                right: 5,
                padding: '4px',
                backgroundColor: 'transparent',
                opacity: 1,
                visibility: 'visible',
                zIndex: 10,
                '&:hover': {
                    backgroundColor: isDarkMode
                        ? 'rgba(0, 0, 0, 0.1)'
                        : 'rgba(0, 0, 0, 0.05)',
                }
            }}>
                  {copiedMessageIndex === index ?
                <Done_1.default fontSize="small"/> :
                <ContentCopy_1.default fontSize="small"/>}
                </material_1.IconButton>
              </material_1.Tooltip>
              
              {/* Markdown контент */}
              <material_1.Box className="markdown">
                <react_markdown_1.default remarkPlugins={[remark_gfm_1.default]}>
                  {message.parts}
                </react_markdown_1.default>
              </material_1.Box>
            </material_1.Paper>
          </material_1.Box>))}
        
        {isLoading && (<material_1.Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
            <material_1.CircularProgress size={24}/>
          </material_1.Box>)}
        
        {error && (<material_1.Box sx={{
                p: 2,
                backgroundColor: isDarkMode ? 'rgba(183, 28, 28, 0.15)' : '#ffebee',
                borderRadius: 1,
                color: isDarkMode ? '#f44336' : '#c62828',
                alignSelf: 'center'
            }}>
            <material_1.Typography variant="body2">{error}</material_1.Typography>
          </material_1.Box>)}
        
        <div ref={messagesEndRef}/>
      </material_1.Box>
      
      <material_1.Divider />
      
      {/* Область ввода сообщения */}
      <material_1.Box sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.1)' : 'transparent'
        }}>
        <material_1.TextField fullWidth multiline maxRows={4} placeholder="Введите сообщение..." value={newMessage} onChange={e => setNewMessage(e.target.value)} onKeyDown={handleKeyPress} disabled={isLoading} variant="outlined" size="small" sx={{
            '& .MuiOutlinedInput-root': {
                backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                '& fieldset': {
                    borderWidth: '3px',
                    borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.23)' : 'rgba(0, 0, 0, 0.23)'
                },
                '&:hover fieldset': {
                    borderWidth: '3px',
                    borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)'
                },
                '&.Mui-focused fieldset': {
                    borderWidth: '3px'
                }
            }
        }}/>
        <material_1.IconButton color="primary" onClick={handleSend} disabled={isLoading || !newMessage.trim()} size="large">
          <Send_1.default />
        </material_1.IconButton>
      </material_1.Box>
    </material_1.Paper>);
};
exports.default = Chat;
