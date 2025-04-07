export class ChatAnalyzer {
    constructor(jsonData) {
        this.owner = '';
        this.companion = '';
        this.ownerID = '';
        this.companionID = '';
        this.chatData = JSON.parse(jsonData);
        this.initializeParticipants();
    }
    initializeParticipants() {
        // Создаем карту участников для подсчета сообщений
        const participants = new Map();
        // Перебираем все сообщения и собираем статистику по отправителям
        this.chatData.messages.forEach((msg) => {
            if (msg.type === 'message' && msg.from && msg.from_id) {
                if (!participants.has(msg.from_id)) {
                    participants.set(msg.from_id, {
                        name: msg.from,
                        id: msg.from_id,
                        messageCount: 0
                    });
                }
                participants.get(msg.from_id).messageCount++;
            }
        });
        // Преобразуем Map в массив для сортировки
        const participantsArray = Array.from(participants.values());
        // Сортируем по количеству сообщений (по убыванию)
        participantsArray.sort((a, b) => b.messageCount - a.messageCount);
        if (participantsArray.length >= 2) {
            // Участник с наибольшим количеством сообщений обычно является владельцем чата
            const mainParticipant = participantsArray[0];
            const secondParticipant = participantsArray[1];
            // Проверяем, совпадает ли имя в поле name с одним из участников
            if (this.chatData.name === mainParticipant.name) {
                // Если имя в поле name совпадает с наиболее активным участником,
                // значит это собеседник, а владелец - второй участник
                this.companion = mainParticipant.name;
                this.companionID = mainParticipant.id;
                this.owner = secondParticipant.name;
                this.ownerID = secondParticipant.id;
            }
            else {
                // В противном случае наиболее активный участник - владелец
                this.owner = mainParticipant.name;
                this.ownerID = mainParticipant.id;
                this.companion = secondParticipant.name;
                this.companionID = secondParticipant.id;
            }
        }
        else {
            // Если найден только один участник
            if (participantsArray.length === 1) {
                const participant = participantsArray[0];
                if (this.chatData.name === participant.name) {
                    this.companion = participant.name;
                    this.companionID = participant.id;
                    this.owner = 'Неизвестный';
                    this.ownerID = '';
                }
                else {
                    this.owner = participant.name;
                    this.ownerID = participant.id;
                    this.companion = this.chatData.name || 'Неизвестный собеседник';
                    this.companionID = '';
                }
            }
            else {
                // Если участников не найдено
                this.companion = this.chatData.name || 'Неизвестный собеседник';
                this.companionID = '';
                this.owner = 'Неизвестный';
                this.ownerID = '';
            }
        }
    }
    countEmoji(text) {
        // Используем комбинацию регулярных выражений для охвата различных типов эмодзи
        const emojiRegexes = [
            // Основные эмодзи
            /[\u{1F300}-\u{1F9FF}]/gu,
            // Дополнительные символы и модификаторы
            /[\u{1F000}-\u{1F02F}]/gu,
            /[\u{1F0A0}-\u{1F0FF}]/gu,
            /[\u{1F100}-\u{1F2FF}]/gu,
            // Разные символические наборы
            /[\u{1F600}-\u{1F64F}]/gu, // Эмоциональные
            /[\u{1F680}-\u{1F6FF}]/gu, // Транспорт и символы
            /[\u{2600}-\u{26FF}]/gu, // Разные символы
            /[\u{2700}-\u{27BF}]/gu, // Декоративные символы
            /[\u{1F1E6}-\u{1F1FF}]/gu // Региональные индикаторы
        ];
        let emojiCount = 0;
        for (const regex of emojiRegexes) {
            const matches = text.match(regex);
            if (matches) {
                emojiCount += matches.length;
            }
        }
        return emojiCount;
    }
    getMessageText(message) {
        if (typeof message.text === 'string') {
            return message.text;
        }
        else if (Array.isArray(message.text)) {
            return message.text
                .map(item => typeof item === 'string' ? item : item.text)
                .join('');
        }
        return '';
    }
    analyze() {
        const messages = this.chatData.messages;
        const firstMessage = messages[messages.length - 1];
        const lastMessage = messages[0];
        // Период переписки в днях
        const chatPeriod = Math.ceil((new Date(lastMessage.date).getTime() - new Date(firstMessage.date).getTime())
            / (1000 * 60 * 60 * 24));
        let stats = {
            owner: this.owner,
            companion: this.companion,
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
        messages.forEach((message) => {
            if (message.type !== 'message')
                return; // Пропускаем сервисные сообщения
            const text = this.getMessageText(message);
            const isOwner = message.from_id === this.ownerID;
            const textWithoutSpaces = text.replace(/\s/g, '');
            // Подсчет сообщений
            stats.totalMessages++;
            if (isOwner) {
                stats.ownerMessages++;
            }
            else {
                stats.companionMessages++;
            }
            // Подсчет символов
            stats.totalCharacters += textWithoutSpaces.length;
            if (isOwner) {
                stats.ownerCharacters += textWithoutSpaces.length;
            }
            else {
                stats.companionCharacters += textWithoutSpaces.length;
            }
            // Подсчет эмодзи
            const emojiCount = this.countEmoji(text);
            stats.totalEmoji += emojiCount;
            if (isOwner) {
                stats.ownerEmoji += emojiCount;
            }
            else {
                stats.companionEmoji += emojiCount;
            }
            // Подсчет реакций
            if (message.reactions) {
                message.reactions.forEach(reaction => {
                    stats.totalReactions++;
                    if (reaction.from === this.ownerID) {
                        stats.ownerReactions++;
                    }
                    else {
                        stats.companionReactions++;
                    }
                });
            }
        });
        return stats;
    }
}
