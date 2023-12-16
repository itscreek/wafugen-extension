export interface Message {
  type: MessageType;
}

export type MessageType = 'TsuriScoreRequest' | 'TsuriScoreResponse';

export interface TsuriScoreRequestMessage extends Message {
  type: 'TsuriScoreRequest';
  videoId: string;
}

export interface TsuriScoreResponseMessage extends Message {
  type: 'TsuriScoreResponse';
  videoId: string;
  tsuriScore: number;
}
