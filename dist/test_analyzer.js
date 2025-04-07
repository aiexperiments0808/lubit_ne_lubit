import { ChatAnalyzer } from './services/chatAnalyzer';
import * as fs from 'fs';
import * as path from 'path';
try {
    // Читаем тестовый файл
    const jsonPath = path.join(__dirname, '..', 'test_chat.json');
    const jsonData = fs.readFileSync(jsonPath, 'utf8');
    const chatData = JSON.parse(jsonData);
    // Создаем экземпляр анализатора
    const analyzer = new ChatAnalyzer(chatData);
    // Получаем статистику
    const stats = analyzer.analyze();
    // Выводим результаты
    console.log('Статистика чата:');
    console.log('----------------');
    console.log(`Владелец чата: ${stats.owner}`);
    console.log(`Собеседник: ${stats.companion}`);
    console.log(`Период переписки (дней): ${stats.chatPeriodDays}`);
    console.log('\nСообщения:');
    console.log(`Всего сообщений: ${stats.totalMessages}`);
    console.log(`Сообщений от ${stats.owner}: ${stats.ownerMessages}`);
    console.log(`Сообщений от ${stats.companion}: ${stats.companionMessages}`);
    console.log('\nСимволы:');
    console.log(`Всего символов: ${stats.totalCharacters}`);
    console.log(`Символов от ${stats.owner}: ${stats.ownerCharacters}`);
    console.log(`Символов от ${stats.companion}: ${stats.companionCharacters}`);
    console.log('\nЭмодзи:');
    console.log(`Всего эмодзи: ${stats.totalEmoji}`);
    console.log(`Эмодзи от ${stats.owner}: ${stats.ownerEmoji}`);
    console.log(`Эмодзи от ${stats.companion}: ${stats.companionEmoji}`);
    console.log('\nРеакции:');
    console.log(`Всего реакций: ${stats.totalReactions}`);
    console.log(`Реакций от ${stats.owner}: ${stats.ownerReactions}`);
    console.log(`Реакций от ${stats.companion}: ${stats.companionReactions}`);
}
catch (error) {
    console.error('Произошла ошибка:', error);
}
