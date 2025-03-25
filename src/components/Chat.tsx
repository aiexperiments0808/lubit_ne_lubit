import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  Paper, 
  Typography, 
  CircularProgress,
  IconButton,
  Divider,
  useTheme,
  Tooltip,
  Fade
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DoneIcon from '@mui/icons-material/Done';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { sendMessage, ChatMessageHistory } from '../services/geminiService';

interface ChatProps {
  initialAnalysis: string;
}

const Chat: React.FC<ChatProps> = ({ initialAnalysis }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  
  const [messages, setMessages] = useState<ChatMessageHistory[]>([
    { role: 'model', parts: initialAnalysis }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedMessageIndex, setCopiedMessageIndex] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Прокрутка вниз при появлении новых сообщений
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Сброс статуса "скопировано" через 2 секунды
  useEffect(() => {
    if (copiedMessageIndex !== null) {
      const timer = setTimeout(() => {
        setCopiedMessageIndex(null);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [copiedMessageIndex]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    
    // Добавляем сообщение пользователя
    const userMessage: ChatMessageHistory = { role: 'user', parts: newMessage };
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsLoading(true);
    setError(null);
    
    try {
      // Отправляем запрос с историей чата
      const response = await sendMessage(newMessage, messages);
      
      // Добавляем ответ модели
      const modelMessage: ChatMessageHistory = { role: 'model', parts: response };
      setMessages(prev => [...prev, modelMessage]);
    } catch (err) {
      setError((err as Error).message || 'Произошла ошибка при отправке сообщения');
      console.error('Ошибка в чате:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const copyMessage = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopiedMessageIndex(index);
      })
      .catch(err => {
        console.error('Ошибка при копировании текста: ', err);
      });
  };

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        height: '578px', 
        display: 'flex', 
        flexDirection: 'column',
        border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.12)' : 'none'
      }}
    >
      {/* Область сообщений */}
      <Box sx={{ 
        flexGrow: 1, 
        overflowY: 'auto', 
        p: 2, 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 2,
        backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.2)' : '#f5f5f5'
      }}>
        {messages.map((message, index) => (
          <Box 
            key={index} 
            sx={{ 
              alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '80%',
              minWidth: '40%',
              position: 'relative'
            }}
          >
            <Paper 
              elevation={1} 
              sx={{ 
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
              }}
            >
              {/* Кнопка копирования */}
              <Tooltip 
                title={copiedMessageIndex === index ? "Скопировано!" : "Копировать"} 
                arrow
                TransitionComponent={Fade}
                TransitionProps={{ timeout: 600 }}
              >
                <IconButton 
                  size="small"
                  onClick={() => copyMessage(message.parts, index)}
                  color={copiedMessageIndex === index ? "success" : "default"}
                  sx={{
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
                  }}
                >
                  {copiedMessageIndex === index ? 
                    <DoneIcon fontSize="small" /> : 
                    <ContentCopyIcon fontSize="small" />
                  }
                </IconButton>
              </Tooltip>
              
              {/* Markdown контент */}
              <Box className="markdown">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {message.parts}
                </ReactMarkdown>
              </Box>
            </Paper>
          </Box>
        ))}
        
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
            <CircularProgress size={24} />
          </Box>
        )}
        
        {error && (
          <Box sx={{ 
            p: 2, 
            backgroundColor: isDarkMode ? 'rgba(183, 28, 28, 0.15)' : '#ffebee', 
            borderRadius: 1, 
            color: isDarkMode ? '#f44336' : '#c62828',
            alignSelf: 'center'
          }}>
            <Typography variant="body2">{error}</Typography>
          </Box>
        )}
        
        <div ref={messagesEndRef} />
      </Box>
      
      <Divider />
      
      {/* Область ввода сообщения */}
      <Box sx={{ 
        p: 2, 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1,
        backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.1)' : 'transparent'
      }}>
        <TextField 
          fullWidth
          multiline
          maxRows={4}
          placeholder="Введите сообщение..."
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          disabled={isLoading}
          variant="outlined"
          size="small"
          sx={{
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
          }}
        />
        <IconButton 
          color="primary" 
          onClick={handleSend} 
          disabled={isLoading || !newMessage.trim()}
          size="large"
        >
          <SendIcon />
        </IconButton>
      </Box>
    </Paper>
  );
};

export default Chat; 