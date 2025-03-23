import React, { useState, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  AlertTitle,
  useTheme,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Badge
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DescriptionIcon from '@mui/icons-material/Description';
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from '@mui/material/styles';
import { analyzeChatHistory, analyzeMultipleChats, hasApiKey } from '../services/geminiService';

interface FileUploadProps {
  onAnalysisComplete: (result: string) => void;
}

const UploadBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isDragging' && prop !== 'isDarkMode',
})<{ isDragging: boolean; isDarkMode: boolean }>(({ isDragging, isDarkMode, theme }) => ({
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

const FileUpload: React.FC<FileUploadProps> = ({ onAnalysisComplete }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';
  
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [processedFiles, setProcessedFiles] = useState<{name: string, content: string}[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const validateFile = (file: File): boolean => {
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

  const extractChatContent = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const content = event.target?.result as string;
          
          // Проверяем, JSON ли это
          if (file.name.endsWith('.json')) {
            try {
              const jsonData = JSON.parse(content);
              // Извлекаем сообщения из JSON структуры Telegram
              if (jsonData.messages) {
                const messages = jsonData.messages
                  .map((msg: any) => {
                    // Извлекаем имя, дату и текст сообщения
                    const from = msg.from || 'Unknown';
                    const date = msg.date || '';
                    const text = Array.isArray(msg.text) 
                      ? msg.text.map((t: any) => (typeof t === 'string' ? t : t.text)).join('')
                      : msg.text || '';
                    
                    return `${from} (${date}): ${text}`;
                  })
                  .join('\n');
                
                resolve(messages);
              } else {
                reject(new Error('Неверный формат JSON файла Telegram'));
              }
            } catch (e) {
              reject(new Error('Ошибка при парсинге JSON'));
            }
          } 
          // Обрабатываем HTML
          else if (file.name.endsWith('.html')) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(content, 'text/html');
            const messages = Array.from(doc.querySelectorAll('.message')).map(msg => {
              const from = msg.querySelector('.from_name')?.textContent || 'Unknown';
              const text = msg.querySelector('.text')?.textContent || '';
              const date = msg.querySelector('.date')?.textContent || '';
              
              return `${from} (${date}): ${text}`;
            }).join('\n');
            
            if (messages) {
              resolve(messages);
            } else {
              reject(new Error('Не удалось извлечь сообщения из HTML'));
            }
          } else {
            reject(new Error('Неподдерживаемый формат файла'));
          }
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Ошибка при чтении файла'));
      };
      
      reader.readAsText(file);
    });
  };

  const processFiles = async (files: File[]) => {
    // Проверяем наличие API ключа
    if (!hasApiKey()) {
      setError('Необходимо добавить API ключ Gemini в настройках');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    const invalidFiles: string[] = [];
    const validFiles: File[] = [];
    
    // Проверяем все файлы на валидность
    for (const file of files) {
      if (validateFile(file)) {
        validFiles.push(file);
      } else {
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
      const processedContents: {name: string, content: string}[] = [];
      
      for (const file of validFiles) {
        try {
          const chatContent = await extractChatContent(file);
          
          // Если контент слишком короткий, пропускаем файл
          if (chatContent.length < 100) {
            invalidFiles.push(file.name + ' (слишком короткий контент)');
            continue;
          }
          
          processedContents.push({
            name: file.name,
            content: chatContent
          });
        } catch (fileError) {
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
      const analysis = await analyzeMultipleChats(processedContents.map(file => file.content));
      onAnalysisComplete(analysis);
    } catch (error: any) {
      console.error('Ошибка при обработке файлов:', error);
      setError(error instanceof Error ? error.message : 'Произошла неизвестная ошибка');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const filesArray = Array.from(e.dataTransfer.files);
      processFiles(filesArray);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleClick();
  };
  
  const handleRemoveFile = (index: number) => {
    const newFiles = [...processedFiles];
    newFiles.splice(index, 1);
    setProcessedFiles(newFiles);
    
    // Если файлов не осталось, очищаем состояние
    if (newFiles.length === 0) {
      fileInputRef.current!.value = '';
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
      const analysis = await analyzeMultipleChats(processedFiles.map(file => file.content));
      onAnalysisComplete(analysis);
    } catch (error: any) {
      console.error('Ошибка при анализе файлов:', error);
      setError(error instanceof Error ? error.message : 'Произошла неизвестная ошибка');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ my: 3 }}>
      {!hasApiKey() && (
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
          <AlertTitle>Требуется API ключ</AlertTitle>
          Пожалуйста, добавьте API ключ Gemini, нажав на кнопку настроек вверху страницы.
        </Alert>
      )}
      
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept=".html,.json"
        onChange={handleFileInputChange}
        multiple
      />
      
      {processedFiles.length > 0 ? (
        <Box sx={{ mb: 3, mt: 2 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Загруженные файлы ({processedFiles.length})
          </Typography>
          <List sx={{ 
            bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'background.paper',
            borderRadius: 1,
            mb: 2
          }}>
            {processedFiles.map((file, index) => (
              <ListItem 
                key={index}
                secondaryAction={
                  <Button 
                    size="small" 
                    color="error"
                    onClick={() => handleRemoveFile(index)}
                    startIcon={<DeleteIcon />}
                  >
                    Удалить
                  </Button>
                }
              >
                <ListItemIcon>
                  <DescriptionIcon color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary={file.name} 
                  secondary={`${Math.round(file.content.length / 100) / 10} KB`} 
                />
              </ListItem>
            ))}
          </List>
          
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between' }}>
            <Button
              variant="outlined"
              onClick={handleClick}
              startIcon={<CloudUploadIcon />}
              disabled={isLoading}
            >
              Добавить ещё файлы
            </Button>
            
            <Button
              variant="contained"
              color="primary"
              onClick={handleAnalyze}
              disabled={isLoading || processedFiles.length === 0}
            >
              {isLoading ? 'Анализ...' : 'Анализировать все файлы'}
            </Button>
          </Box>
        </Box>
      ) : (
        <UploadBox
          isDragging={isDragging}
          isDarkMode={isDarkMode}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Перетащите файлы сюда или нажмите для выбора
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Поддерживаемые форматы: HTML, JSON (экспорт из Telegram)
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Максимальный размер файла: 10 МБ
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Можно загрузить несколько файлов одновременно
          </Typography>
          <Button
            variant="contained"
            startIcon={<CloudUploadIcon />}
            onClick={handleButtonClick}
            disabled={isLoading}
          >
            Выбрать файлы
          </Button>
        </UploadBox>
      )}
      
      {isLoading && (
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center', 
            my: 3, 
            gap: 2 
          }}
        >
          <CircularProgress size={40} />
          <Typography variant="body2" color="text.secondary">
            Анализируем ваши данные...
          </Typography>
        </Box>
      )}
      
      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mt: 2,
            ...(isDarkMode && {
              backgroundColor: 'rgba(211, 47, 47, 0.1)',
              color: 'error.light'
            })
          }}
        >
          <AlertTitle>Ошибка</AlertTitle>
          {error}
        </Alert>
      )}
    </Box>
  );
};

export default FileUpload; 