// 세대 구분
export type Generation = 'gen-z' | 'millennial' | 'gen-x' | 'boomer';

// 언어/신조어 변환 관련
export interface SlangTranslation {
  id: string;
  originalText: string;
  translatedText: string;
  sourceGeneration: Generation;
  targetGeneration: Generation;
  confidence: number;
  explanation: string;
  examples: string[];
  createdAt: Date;
}

// 퀴즈 관련
export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  targetGeneration: Generation;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  createdAt: Date;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  generation: Generation;
  points: number;
}

export interface QuizResult {
  id: string;
  userId: string;
  quizId: string;
  score: number;
  totalPoints: number;
  answers: UserAnswer[];
  generationMatch: Record<Generation, number>;
  insights: string[];
  completedAt: Date;
}

export interface UserAnswer {
  questionId: string;
  selectedAnswer: number;
  isCorrect: boolean;
  timeSpent: number;
}

// 대화 분석 관련
export interface ConversationAnalysis {
  id: string;
  conversationText: string;
  participants: Participant[];
  emotionAnalysis: EmotionAnalysis;
  generationInsights: GenerationInsight[];
  suggestions: Suggestion[];
  analyzedAt: Date;
}

export interface Participant {
  id: string;
  name: string;
  generation: Generation;
  estimatedAge?: number;
}

export interface EmotionAnalysis {
  overall: Emotion;
  byParticipant: Record<string, Emotion>;
  emotionFlow: EmotionPoint[];
}

export interface Emotion {
  positive: number;
  negative: number;
  neutral: number;
  dominant: 'positive' | 'negative' | 'neutral';
  intensity: number;
  specificEmotions: {
    joy: number;
    sadness: number;
    anger: number;
    fear: number;
    surprise: number;
    disgust: number;
  };
}

export interface EmotionPoint {
  timestamp: number;
  emotion: Emotion;
  text: string;
  speaker: string;
}

export interface GenerationInsight {
  generation: Generation;
  communicationStyle: string;
  languagePatterns: string[];
  emotionalTendencies: string[];
  recommendations: string[];
}

export interface Suggestion {
  type: 'language' | 'emotion' | 'approach';
  priority: 'high' | 'medium' | 'low';
  description: string;
  example: string;
  targetGeneration?: Generation;
}

// 사용자 관련
export interface User {
  id: string;
  email: string;
  name: string;
  generation: Generation;
  birthYear?: number;
  preferences: UserPreferences;
  stats: UserStats;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  language: 'ko' | 'en';
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  privacyLevel: 'public' | 'private';
}

export interface UserStats {
  translationsUsed: number;
  quizzesCompleted: number;
  conversationsAnalyzed: number;
  averageQuizScore: number;
  favoriteTargetGeneration: Generation;
  totalTimeSpent: number; // in minutes
}

// API 응답 타입
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// OpenAI API 관련
export interface OpenAIRequest {
  prompt: string;
  maxTokens: number;
  temperature: number;
  model: string;
}

export interface OpenAIResponse {
  choices: Array<{
    text: string;
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}