export interface PredictionResponse {
  label: string;
  confidence: number;
}

export type FeedbackStatus = 'correct' | 'incorrect';

export interface ScanFeedback {
  status: FeedbackStatus;
  correctedLabel?: string;
}
