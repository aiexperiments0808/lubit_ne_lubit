import { ChatStatistics, MessageData } from '../types/chat';

interface Participant {
  name: string;
  id: string;
  messageCount: number;
}

export class ChatAnalyzer {
  private chatData: any;
  private interlocutor: string = '';
  private interlocutorID: string = '';
  private user: string = '';
  private userID: string = '';

  constructor(jsonData: string) {
    this.chatData = JSON.parse(jsonData);
    this.initializeParticipants();
  }

  private initializeParticipants(): void {
    // Создаем карту участников для подсчета сообщений
    const participants = new Map<string, Participant>();
    
    // Перебираем все сообщения и собираем статистику по отправителям
    this.chatData.messages.forEach((msg: MessageData) => {
      // Учитываем сообщения от пользователей (не системные)
      if (msg.from && msg.from_id && msg.type !== 'service') {
        if (!participants.has(msg.from_id)) {
          participants.set(msg.from_id, {
            name: msg.from,
            id: msg.from_id,
            messageCount: 0
          });
        }
        participants.get(msg.from_id)!.messageCount++;
      }
    });

    // Получаем имя собеседника из поля name
    const shortName = this.chatData.name;

    // Находим ID собеседника и определяем второго участника
    const participantsArray = Array.from(participants.values());
    
    // Ищем собеседника среди участников (проверяем, содержит ли полное имя короткое)
    const interlocutorParticipant = participantsArray.find(p => p.name.includes(shortName));
    if (interlocutorParticipant) {
      this.interlocutor = interlocutorParticipant.name;
      this.interlocutorID = interlocutorParticipant.id;
      
      // Находим второго участника (пользователя)
      const userParticipant = participantsArray.find(p => p.id !== interlocutorParticipant.id);
      if (userParticipant) {
        this.user = userParticipant.name;
        this.userID = userParticipant.id;
      }
    } else {
      // Если не нашли собеседника по имени
      this.interlocutor = shortName;
      this.interlocutorID = '';
    }

    // Если не удалось определить пользователя
    if (!this.user) {
      this.user = 'Неизвестный пользователь';
      this.userID = '';
    }
  }

  private countEmoji(text: string): number {
    // Используем регулярное выражение для поиска эмодзи
    // \p{Extended_Pictographic} находит все эмодзи
    // [\u{1F3FB}-\u{1F3FF}]? учитывает модификаторы тона кожи
    // (\u200D[\p{Extended_Pictographic}][\u{1F3FB}-\u{1F3FF}]?)* учитывает составные эмодзи с ZWJ
    // \uFE0F? учитывает вариационный селектор
    const emojiRegex = /\p{Extended_Pictographic}[\u{1F3FB}-\u{1F3FF}]?(\u200D\p{Extended_Pictographic}[\u{1F3FB}-\u{1F3FF}]?)*\uFE0F?|\p{Regional_Indicator}{2}/gu;
    
    const matches = text.match(emojiRegex);
    return matches ? matches.length : 0;
  }

  private getMessageText(message: MessageData): string {
    if (typeof message.text === 'string') {
      return message.text;
    } else if (Array.isArray(message.text)) {
      return message.text
        .map(item => typeof item === 'string' ? item : item.text)
        .join('');
    }
    return '';
  }

  public analyze(): ChatStatistics {
    const messages = this.chatData.messages;
    const firstMessage = messages[messages.length - 1];
    const lastMessage = messages[0];
    
    // Период переписки в днях (используем Math.abs для получения положительного значения)
    const chatPeriod = Math.abs(Math.ceil(
      (new Date(lastMessage.date).getTime() - new Date(firstMessage.date).getTime()) 
      / (1000 * 60 * 60 * 24)
    ));

    let stats = {
      owner: this.user,
      companion: this.interlocutor,
      chatPeriodDays: chatPeriod,
      totalMessages: 0,
      ownerMessages: 0,
      companionMessages: 0,
      totalCharacters: 0,
      ownerCharacters: 0,
      companionCharacters: 0,
      totalEmoji: 0,
      ownerEmoji: 0,
      companionEmoji: 0,
      totalReactions: 0,
      ownerReactions: 0,
      companionReactions: 0
    };

    // Анализ сообщений
    messages.forEach((message: MessageData) => {
      // Пропускаем только системные сообщения
      if (message.type === 'service') return;

      // Проверяем, что сообщение от пользователя
      if (!message.from || !message.from_id) return;

      const text = this.getMessageText(message);
      const isUser = message.from_id === this.userID;
      const textWithoutSpaces = text.replace(/\s/g, '');
      
      // Подсчет сообщений
      stats.totalMessages++;
      if (isUser) {
        stats.ownerMessages++;
      } else {
        stats.companionMessages++;
      }

      // Подсчет символов (если есть текст)
      if (text) {
        stats.totalCharacters += textWithoutSpaces.length;
        if (isUser) {
          stats.ownerCharacters += textWithoutSpaces.length;
        } else {
          stats.companionCharacters += textWithoutSpaces.length;
        }

        // Подсчет эмодзи
        const emojiCount = this.countEmoji(text);
        stats.totalEmoji += emojiCount;
        if (isUser) {
          stats.ownerEmoji += emojiCount;
        } else {
          stats.companionEmoji += emojiCount;
        }
      }

      // Подсчет реакций
      if (message.reactions) {
        message.reactions.forEach(reaction => {
          stats.totalReactions++;
          if (reaction.from === this.userID) {
            stats.ownerReactions++;
          } else {
            stats.companionReactions++;
          }
        });
      }
    });

    return stats;
  }
} 