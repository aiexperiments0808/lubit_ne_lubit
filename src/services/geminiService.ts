import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

// Функции для работы с API ключом
export const getApiKey = (): string => {
  return localStorage.getItem('gemini_api_key') || '';
};

export const setApiKey = (key: string): void => {
  localStorage.setItem('gemini_api_key', key);
};

export const hasApiKey = (): boolean => {
  return Boolean(getApiKey());
};

// Константы для хранения настроек в localStorage
const STORAGE_KEYS = {
  API_KEY: 'gemini_api_key',
  SYSTEM_PROMPT: 'gemini_system_prompt',
  MODEL_NAME: 'gemini_model_name'
};

// Дефолтный системный промпт
const DEFAULT_SYSTEM_PROMPT = `Ты - опытный психолог, который анализирует текстовые переписки.
Твоя задача - проанализировать историю чата и определить:
1. Какие отношения существуют между собеседниками
2. Есть ли между ними романтический интерес
3. Кто проявляет больший интерес и инициативу
4. Есть ли признаки манипуляций или токсичных отношений
5. Общую динамику и перспективы отношений

Используй Markdown для форматирования своих ответов:
- Используй **жирный текст** для выделения важных выводов
- Используй *курсив* для цитат из переписки
- Используй списки для перечисления наблюдений
- Используй > для цитирования конкретных сообщений
- Используй ### для подзаголовков разделов анализа
- Используй \`код\` для технических терминов
- Используй ~~зачеркивание~~ для указания на ошибочные предположения

Будь объективным в своем анализе, основывайся на фактах из переписки.
Давай полезные советы, исходя из своего анализа.
Отвечай на русском языке.`;

// Дефолтная модель
const DEFAULT_MODEL_NAME = 'gemini-2.0-flash';

// Функции для работы с системным промптом
export const getSystemPrompt = (useDefault = false): string => {
  if (useDefault) return DEFAULT_SYSTEM_PROMPT;
  return localStorage.getItem(STORAGE_KEYS.SYSTEM_PROMPT) || DEFAULT_SYSTEM_PROMPT;
};

export const setSystemPrompt = (prompt: string): void => {
  localStorage.setItem(STORAGE_KEYS.SYSTEM_PROMPT, prompt);
};

// Функции для работы с моделью
export const getModelName = (): string => {
  return localStorage.getItem(STORAGE_KEYS.MODEL_NAME) || DEFAULT_MODEL_NAME;
};

export const setModelName = (modelName: string): void => {
  localStorage.setItem(STORAGE_KEYS.MODEL_NAME, modelName);
};

// Получение списка доступных моделей
export const listAvailableModels = async (): Promise<string[]> => {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('Необходимо добавить API ключ Gemini');
  }
  
  try {
    // Используем официальный API для получения списка моделей
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models?key=' + apiKey);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Ошибка API: ${errorData.error?.message || response.statusText}`);
    }
    
    const data = await response.json();
    
    // Фильтруем только модели Gemini
    const geminiModels = data.models
      .filter((model: any) => model.name.includes('gemini'))
      .map((model: any) => model.name.split('/').pop());
    
    // Если не удалось найти модели, возвращаем хотя бы дефолтную
    if (geminiModels.length === 0) {
      return [DEFAULT_MODEL_NAME];
    }
    
    return geminiModels;
  } catch (error) {
    console.error('Ошибка при получении списка моделей:', error);
    // В случае ошибки возвращаем хотя бы предопределенный список основных моделей
    return ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro'];
  }
};

// Интерфейс для сообщения в соответствии с @google/generative-ai
export interface ChatMessageHistory {
  role: 'user' | 'model';
  parts: string;
}

// Проверка наличия API ключа с выбросом стандартной ошибки
const checkApiKey = (): string => {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error('API_KEY_MISSING');
  }
  return apiKey;
};

// Получение настроенного экземпляра модели
const getModel = (apiKey: string) => {
  const genAI = new GoogleGenerativeAI(apiKey);
  
  // Получаем имя модели и обрабатываем его
  // API возвращает модели в формате "models/gemini-1.5-flash" и т.д.
  const modelName = getModelName();
  // Если имя модели содержит полный путь (models/xxx), используем только имя модели
  const actualModelName = modelName.includes('/') ? modelName.split('/').pop() || DEFAULT_MODEL_NAME : modelName;
  
  return genAI.getGenerativeModel({
    model: actualModelName,
    safetySettings: [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
      },
    ],
  });
};

// Функция для анализа истории чата
export const analyzeChatHistory = async (content: string): Promise<string> => {
  try {
    const apiKey = checkApiKey();
    const model = getModel(apiKey);
    const systemPrompt = getSystemPrompt();

    // Добавляем инструкции по форматированию
    const formattingInstructions = `
Структурируй свой анализ с помощью Markdown:

### Общая характеристика отношений
Опиши здесь основные выводы об отношениях

### Романтический интерес
Проанализируй наличие романтического интереса

### Инициатива в общении
Опиши, кто проявляет больший интерес

### Проблемные моменты
Укажи на возможные манипуляции или токсичные паттерны

### Динамика и перспективы
Опиши, как развиваются отношения и их потенциал

### Рекомендации
Предложи конкретные советы

Используй форматирование:
- **Жирный текст** для ключевых выводов
- *Курсив* для цитат из переписки
- Списки для перечисления наблюдений
- > Цитаты для конкретных сообщений
- \`Код\` для терминов
- ~~Зачеркивание~~ для исправлений
`;

    const prompt = `${systemPrompt}

Вот история чата для анализа:

${content}

${formattingInstructions}

Пожалуйста, проанализируй эти сообщения и дай свою оценку отношений между людьми в этой переписке, используя предложенную структуру и форматирование.`;
    
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error: any) {
    console.error('Ошибка при анализе чата:', error);
    
    if (error.message.includes('SAFETY')) {
      throw new Error('Контент был заблокирован по правилам безопасности Google. Возможно, переписка содержит потенциально недопустимое содержимое. Попробуйте изменить или сократить переписку.');
    }
    
    if (error.message === 'API_KEY_MISSING') {
      throw new Error('Необходимо добавить API ключ Gemini в настройках');
    }
    
    throw error;
  }
};

// Функция для анализа нескольких чатов
export const analyzeMultipleChats = async (chatContents: string[]): Promise<string> => {
  try {
    // Если передан только один чат, используем стандартную функцию
    if (chatContents.length === 1) {
      return analyzeChatHistory(chatContents[0]);
    }
    
    const apiKey = checkApiKey();
    const model = getModel(apiKey);
    const systemPrompt = getSystemPrompt();

    // Объединяем содержимое нескольких чатов с разделителями
    const combinedContent = chatContents.map((content, index) => {
      return `### Файл ${index + 1}\n\n${content}\n\n`;
    }).join('\n');

    // Добавляем инструкции по форматированию
    const formattingInstructions = `
Структурируй свой анализ с помощью Markdown:

### Общий анализ переписки
Опиши здесь основные выводы, учитывая все предоставленные фрагменты

### Развитие отношений во времени
Проанализируй, как менялись отношения между собеседниками

### Ключевые моменты
Выдели важные моменты из разных частей переписки

### Проблемные аспекты
Укажи на возможные манипуляции или токсичные паттерны

### Общие рекомендации
Предложи конкретные советы по улучшению отношений

Используй форматирование:
- **Жирный текст** для ключевых выводов
- *Курсив* для цитат из переписки
- Списки для перечисления наблюдений
- > Цитаты для конкретных сообщений
- \`Код\` для терминов
- ~~Зачеркивание~~ для исправлений
`;

    const prompt = `${systemPrompt}

Вот несколько историй чатов для анализа (${chatContents.length} файлов):

${combinedContent}

${formattingInstructions}

Пожалуйста, проанализируй все эти сообщения вместе и дай свою общую оценку отношений между людьми в этих переписках, используя предложенную структуру и форматирование. Учитывай информацию из всех предоставленных фрагментов переписки для создания более полной картины.`;
    
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error: any) {
    console.error('Ошибка при анализе нескольких чатов:', error);
    
    if (error.message.includes('SAFETY')) {
      throw new Error('Контент был заблокирован по правилам безопасности Google. Возможно, переписка содержит потенциально недопустимое содержимое. Попробуйте изменить или сократить переписку.');
    }
    
    if (error.message === 'API_KEY_MISSING') {
      throw new Error('Необходимо добавить API ключ Gemini в настройках');
    }
    
    throw error;
  }
};

// Функция для отправки сообщения в чат
export const sendMessage = async (message: string, history: ChatMessageHistory[] = []): Promise<string> => {
  try {
    const apiKey = checkApiKey();
    const model = getModel(apiKey);
    const systemPrompt = getSystemPrompt();
    
    // Добавляем инструкции по форматированию для каждого нового сообщения
    const formattingInstructions = `
Форматируй свой ответ с помощью Markdown:
- Используй **жирный текст** для важных выводов
- Используй *курсив* для цитат и примеров
- Используй списки для перечисления пунктов
- Используй > для цитирования
- Используй ### для подзаголовков
- Используй \`код\` для терминов
- Используй ~~зачеркивание~~ для исправлений
`;

    // Преобразуем историю и добавляем системный промпт в начало
    const chatHistory = [
      {
        role: 'user' as const,
        parts: [{ text: systemPrompt }],
      },
      ...history.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.parts }],
      })),
      {
        role: 'user' as const,
        parts: [{ text: message + "\n\n" + formattingInstructions }],
      }
    ];
    
    // Отправляем сообщение с историей
    const result = await model.generateContent({
      contents: chatHistory,
    });
    
    return result.response.text();
  } catch (error: any) {
    console.error('Ошибка при отправке сообщения:', error);
    
    if (error.message.includes('SAFETY')) {
      throw new Error('Сообщение было заблокировано по правилам безопасности Google. Пожалуйста, измените содержание сообщения.');
    }
    
    if (error.message === 'API_KEY_MISSING') {
      throw new Error('Необходимо добавить API ключ Gemini в настройках');
    }
    
    throw error;
  }
}; 