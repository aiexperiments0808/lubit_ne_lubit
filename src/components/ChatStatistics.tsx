import React from 'react';
import { 
  Paper, 
  Typography, 
  Grid, 
  Box,
  useTheme 
} from '@mui/material';
import { ChatStatistics as ChatStatisticsType } from '../types/chat';

interface ChatStatisticsProps {
  statistics: ChatStatisticsType;
}

const ChatStatistics: React.FC<ChatStatisticsProps> = ({ statistics }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === 'dark';

  const StatItem = ({ label, value }: { label: string; value: string | number }) => (
    <Box sx={{ mb: 1 }}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="h6">
        {value}
      </Typography>
    </Box>
  );

  return (
    <Paper 
      elevation={1}
      sx={{ 
        p: 3,
        mb: 3,
        backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : '#fff'
      }}
    >
      <Typography variant="h5" gutterBottom>
        Статистика переписки
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <StatItem label="Владелец чата" value={statistics.owner} />
          <StatItem label="Собеседник" value={statistics.companion} />
          <StatItem label="Период переписки (дней)" value={statistics.chatPeriodDays} />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <StatItem label="Всего сообщений" value={statistics.totalMessages} />
          <StatItem label={`Сообщений от ${statistics.owner}`} value={statistics.ownerMessages} />
          <StatItem label={`Сообщений от ${statistics.companion}`} value={statistics.companionMessages} />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <StatItem label="Всего символов" value={statistics.totalCharacters} />
          <StatItem label={`Символов от ${statistics.owner}`} value={statistics.ownerCharacters} />
          <StatItem label={`Символов от ${statistics.companion}`} value={statistics.companionCharacters} />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <StatItem label="Всего эмодзи" value={statistics.totalEmoji} />
          <StatItem label={`Эмодзи от ${statistics.owner}`} value={statistics.ownerEmoji} />
          <StatItem label={`Эмодзи от ${statistics.companion}`} value={statistics.companionEmoji} />
        </Grid>
        
        <Grid item xs={12}>
          <StatItem label="Всего реакций" value={statistics.totalReactions} />
          <StatItem label={`Реакций от ${statistics.owner}`} value={statistics.ownerReactions} />
          <StatItem label={`Реакций от ${statistics.companion}`} value={statistics.companionReactions} />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ChatStatistics; 