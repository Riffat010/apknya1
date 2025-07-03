
export enum AppScreen {
  UPLOAD,
  SETTINGS,
}

export interface AnalysisResult {
  market_asset: string;
  trend: string;
  volatility: string;
  volume: string;
  sentiment: string;
  confidenceScore: number;
  gamePlan: string;
  fundamentalAnalysis: string;
  sources?: { uri: string; title: string; }[];
}

export type Theme = 'light' | 'dark' | 'system';
export type Language = 'id' | 'en';

export interface NewsArticle {
  title: string;
  snippet: string;
  content: string;
  source: string;
  sentiment: 'Bullish' | 'Bearish' | 'Neutral';
  published_at: string;
}