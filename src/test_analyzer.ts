import { analyzeChatHistory } from './services/geminiService';
import * as fs from 'fs';
import * as path from 'path';

// Мок для localStorage
const localStorageMock = {
  store: {} as { [key: string]: string },
  getItem(key: string) {
    return this.store[key] || null;
  },
  setItem(key: string, value: string) {
    this.store[key] = value;
  },
  clear() {
    this.store = {};
  }
};

// Устанавливаем глобальный localStorage
(global as any).localStorage = localStorageMock;

// Устанавливаем API ключ из переменной окружения
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error('Ошибка: Не установлен GEMINI_API_KEY в переменных окружения');
  process.exit(1);
}
console.log('Используется API ключ:', apiKey);
localStorage.setItem('gemini_api_key', apiKey);

async function testAnalysis() {
  try {
    // Читаем тестовый файл
    const jsonData = fs.readFileSync(path.join(__dirname, '../test_chat_types.json'), 'utf8');
    
    console.log('Отправляем данные на анализ...');
    console.log('==============================\n');
    
    // Анализируем чат с помощью Gemini
    const analysis = await analyzeChatHistory(jsonData);
    
    console.log('Результат анализа:');
    console.log('=================\n');
    console.log(analysis);

  } catch (error) {
    console.error('Ошибка при анализе чата:', error);
  }
}

// Запускаем тест
testAnalysis(); 