export enum AppStep {
  DISCLAIMER = 'DISCLAIMER',
  INPUT = 'INPUT',
  ANALYZING = 'ANALYZING',
  QUESTIONING = 'QUESTIONING',
  RESULTS = 'RESULTS',
  CHAT = 'CHAT',
  ERROR = 'ERROR'
}

export type UserProfession = 'Facharzt (Psychiatrie/Neurologie)' | 'Arzt (Andere Fachrichtung)' | 'Psychologischer Psychotherapeut' | 'KJP' | 'Heilpraktiker für Psychotherapie';

export interface Diagnosis {
  code: string;
  name: string;
  probability: number;
  reasoning?: string;
}

export interface PatientData {
  pseudonym: string;
  age: string;
  gender: string;
  suicideHistory: string; // e.g. "Keine", "1 Versuch 2020", etc.
  substanceHistory: string;
  symptoms: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface ApiResponse {
  type: 'question' | 'diagnosis' | 'chat' | 'error';
  content?: string; // For questions or chat responses
  results?: Diagnosis[]; // For diagnoses
}

export interface SavedCase {
  id: string;
  timestamp: number;
  lastModified: number;
  patientData: PatientData;
  diagnoses: Diagnosis[];
  chatHistory?: ChatMessage[];
}

export interface UserSettings {
  profession: UserProfession;
  hasAcceptedDisclaimer: boolean;
}