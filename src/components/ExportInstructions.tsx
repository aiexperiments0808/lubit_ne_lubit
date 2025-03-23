import React, { useState } from 'react';
import { 
  Accordion, 
  AccordionSummary, 
  AccordionDetails, 
  Typography, 
  Box, 
  List, 
  ListItem, 
  ListItemText,
  ListItemIcon,
  useTheme,
  Button
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import NumbersIcon from '@mui/icons-material/Numbers';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import MemoryIcon from '@mui/icons-material/Memory';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

const ExportInstructions: React.FC = () => {
  const [expandedExport, setExpandedExport] = useState(false);
  const [expandedSecurity, setExpandedSecurity] = useState(false);
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  const handleExportChange = () => {
    setExpandedExport(!expandedExport);
  };

  const handleSecurityChange = () => {
    setExpandedSecurity(!expandedSecurity);
  };

  return (
    <>
      <Accordion 
        expanded={expandedExport} 
        onChange={handleExportChange}
        sx={{ 
          mb: 2,
          ...(isDarkMode && {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            backgroundImage: 'none'
          })
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="export-instructions-content"
          id="export-instructions-header"
          sx={{
            ...(isDarkMode && {
              '&.Mui-expanded': {
                backgroundColor: 'rgba(0, 0, 0, 0.2)'
              }
            })
          }}
        >
          <Typography>Как экспортировать чат из Telegram Desktop</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body1" gutterBottom>
              Чтобы проанализировать переписку, необходимо экспортировать чат из Telegram Desktop:
            </Typography>
          </Box>
          
          <List sx={{ 
            ...(isDarkMode && { 
              bgcolor: 'rgba(0, 0, 0, 0.2)',
              borderRadius: 1,
              p: 1 
            }) 
          }}>
            <ListItem>
              <ListItemIcon><NumbersIcon color="primary" /></ListItemIcon>
              <ListItemText 
                primary="Откройте приложение Telegram Desktop на компьютере" 
                secondary="Экспорт доступен только в десктопной версии мессенджера"
                secondaryTypographyProps={{
                  color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary'
                }}
              />
            </ListItem>
            
            <ListItem>
              <ListItemIcon><NumbersIcon color="primary" /></ListItemIcon>
              <ListItemText 
                primary="Откройте нужный чат или диалог" 
                secondary="Выберите личную переписку, которую хотите проанализировать"
                secondaryTypographyProps={{
                  color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary'
                }}
              />
            </ListItem>
            
            <ListItem>
              <ListItemIcon><NumbersIcon color="primary" /></ListItemIcon>
              <ListItemText 
                primary="Нажмите на три точки в правом верхнем углу" 
                secondary="Это откроет меню диалога"
                secondaryTypographyProps={{
                  color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary'
                }}
              />
            </ListItem>
            
            <ListItem>
              <ListItemIcon><NumbersIcon color="primary" /></ListItemIcon>
              <ListItemText 
                primary="Выберите 'Экспортировать чат'" 
                secondary="В некоторых версиях это может называться 'Export chat history'"
                secondaryTypographyProps={{
                  color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary'
                }}
              />
            </ListItem>
            
            <ListItem>
              <ListItemIcon><NumbersIcon color="primary" /></ListItemIcon>
              <ListItemText 
                primary="В настройках экспорта выберите формат HTML или JSON" 
                secondary="Оба формата поддерживаются приложением для анализа"
                secondaryTypographyProps={{
                  color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary'
                }}
              />
            </ListItem>
            
            <ListItem>
              <ListItemIcon><NumbersIcon color="primary" /></ListItemIcon>
              <ListItemText 
                primary="Нажмите 'Экспортировать' и сохраните файл" 
                secondary="После сохранения вы сможете загрузить файл (или несколько файлов) в это приложение"
                secondaryTypographyProps={{
                  color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary'
                }}
              />
            </ListItem>
          </List>
          
          <Box sx={{ 
            mt: 2, 
            bgcolor: isDarkMode ? 'rgba(33, 150, 243, 0.1)' : 'info.main', 
            color: isDarkMode ? 'primary.light' : 'info.contrastText', 
            p: 2, 
            borderRadius: 1 
          }}>
            <Typography variant="body2">
              После экспорта вы получите файл (один или несколько файлов) HTML или JSON, который можно загрузить в приложение 
              для анализа. Приложение извлечет текст сообщений и проанализирует их содержимое 
              с помощью искусственного интеллекта.
            </Typography>
          </Box>
        </AccordionDetails>
      </Accordion>

      <Accordion 
        expanded={expandedSecurity} 
        onChange={handleSecurityChange}
        sx={{ 
          mb: 3,
          ...(isDarkMode && {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            backgroundImage: 'none'
          })
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="security-info-content"
          id="security-info-header"
          sx={{
            ...(isDarkMode && {
              '&.Mui-expanded': {
                backgroundColor: 'rgba(0, 0, 0, 0.2)'
              }
            })
          }}
        >
          <Typography>Безопасность вашей информации</Typography>
        </AccordionSummary>
        <AccordionDetails>
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
                secondaryTypographyProps={{
                  color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary'
                }}
              />
            </ListItem>
            
            <ListItem>
              <ListItemIcon>
                <MemoryIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Анализ искусственным интеллектом" 
                secondary="Для анализа ваших чатов мы используем API Google Gemini. Текст отправляется в Google для обработки согласно их политике конфиденциальности."
                secondaryTypographyProps={{
                  color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary'
                }}
              />
            </ListItem>
            
            <ListItem>
              <ListItemIcon>
                <LinkOffIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Политика Google Gemini" 
                secondary="Подробную информацию о том, как Google обрабатывает данные, можно найти в документации Google Gemini."
                secondaryTypographyProps={{
                  color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary'
                }}
              />
            </ListItem>
            
            <ListItem>
              <ListItemIcon>
                <DeleteForeverIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Удаление данных" 
                secondary="Вы можете в любой момент удалить всю информацию, нажав кнопку 'Забыть всё'. Все данные хранятся только локально в вашем браузере."
                secondaryTypographyProps={{
                  color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'text.secondary'
                }}
              />
            </ListItem>
          </List>
          
          <Box sx={{ 
            mt: 3, 
            bgcolor: isDarkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(25, 118, 210, 0.08)', 
            p: 2, 
            borderRadius: 1 
          }}>
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
        </AccordionDetails>
      </Accordion>
    </>
  );
};

export default ExportInstructions; 