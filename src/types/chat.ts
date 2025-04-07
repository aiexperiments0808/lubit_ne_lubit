export interface MessageData {
  id: number;
  type: 'message' | 'service';
  date: string;
  date_unixtime: string;
  from?: string;
  from_id?: string;
  actor?: string;
  actor_id?: string;
  text: string | Array<string | { text: string; type: string }>;
  text_entities?: Array<{ type: string; text: string }>;
  reactions?: Array<{ from: string }>;
  forwarded_from?: string;
  photo?: string;
  photo_file_size?: number;
  width?: number;
  height?: number;
  action?: string;
  duration_seconds?: number;
  discard_reason?: string;
  reply_to_message_id?: number;
}

export interface ChatStatistics {
  owner: string;
  companion: string;
  chatPeriodDays: number;
  totalMessages: number;
  ownerMessages: number;
  companionMessages: number;
  totalCharacters: number;
  ownerCharacters: number;
  companionCharacters: number;
  totalEmoji: number;
  ownerEmoji: number;
  companionEmoji: number;
  totalReactions: number;
  ownerReactions: number;
  companionReactions: number;
} 