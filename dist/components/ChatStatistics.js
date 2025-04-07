"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const material_1 = require("@mui/material");
const ChatStatistics = ({ statistics }) => {
    const theme = (0, material_1.useTheme)();
    const isDarkMode = theme.palette.mode === 'dark';
    const StatItem = ({ label, value }) => (<material_1.Box sx={{ mb: 1 }}>
      <material_1.Typography variant="body2" color="text.secondary">
        {label}
      </material_1.Typography>
      <material_1.Typography variant="h6">
        {value}
      </material_1.Typography>
    </material_1.Box>);
    return (<material_1.Paper elevation={1} sx={{
            p: 3,
            mb: 3,
            backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : '#fff'
        }}>
      <material_1.Typography variant="h5" gutterBottom>
        Статистика переписки
      </material_1.Typography>
      
      <material_1.Grid container spacing={3}>
        <material_1.Grid item xs={12} sm={6}>
          <StatItem label="Владелец чата" value={statistics.owner}/>
          <StatItem label="Собеседник" value={statistics.companion}/>
          <StatItem label="Период переписки (дней)" value={statistics.chatPeriodDays}/>
        </material_1.Grid>
        
        <material_1.Grid item xs={12} sm={6}>
          <StatItem label="Всего сообщений" value={statistics.totalMessages}/>
          <StatItem label={`Сообщений от ${statistics.owner}`} value={statistics.ownerMessages}/>
          <StatItem label={`Сообщений от ${statistics.companion}`} value={statistics.companionMessages}/>
        </material_1.Grid>
        
        <material_1.Grid item xs={12} sm={6}>
          <StatItem label="Всего символов" value={statistics.totalCharacters}/>
          <StatItem label={`Символов от ${statistics.owner}`} value={statistics.ownerCharacters}/>
          <StatItem label={`Символов от ${statistics.companion}`} value={statistics.companionCharacters}/>
        </material_1.Grid>
        
        <material_1.Grid item xs={12} sm={6}>
          <StatItem label="Всего эмодзи" value={statistics.totalEmoji}/>
          <StatItem label={`Эмодзи от ${statistics.owner}`} value={statistics.ownerEmoji}/>
          <StatItem label={`Эмодзи от ${statistics.companion}`} value={statistics.companionEmoji}/>
        </material_1.Grid>
        
        <material_1.Grid item xs={12}>
          <StatItem label="Всего реакций" value={statistics.totalReactions}/>
          <StatItem label={`Реакций от ${statistics.owner}`} value={statistics.ownerReactions}/>
          <StatItem label={`Реакций от ${statistics.companion}`} value={statistics.companionReactions}/>
        </material_1.Grid>
      </material_1.Grid>
    </material_1.Paper>);
};
exports.default = ChatStatistics;
