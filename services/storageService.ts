import { SavedCase, PatientData, Diagnosis, ChatMessage, UserSettings, UserProfession } from "../types";

const STORAGE_KEY = 'icd10_assistant_cases_v1';
const SETTINGS_KEY = 'icd10_assistant_settings_v1';

// --- User Settings ---

export const saveUserSettings = (profession: UserProfession): UserSettings => {
  const settings: UserSettings = {
    profession,
    hasAcceptedDisclaimer: true
  };
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  return settings;
};

export const getUserSettings = (): UserSettings | null => {
  const stored = localStorage.getItem(SETTINGS_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch (e) {
    return null;
  }
};

export const clearUserSettings = () => {
  localStorage.removeItem(SETTINGS_KEY);
};

// --- Cases ---

export const saveCase = (patientData: PatientData, diagnoses: Diagnosis[], chatHistory: ChatMessage[] = []): SavedCase => {
  const cases = getCases();
  
  // Check if case with pseudonym already exists to update it, or create new
  const existingIndex = cases.findIndex(c => c.patientData.pseudonym === patientData.pseudonym);
  
  let newCase: SavedCase;

  if (existingIndex >= 0) {
    // Update existing
    newCase = {
      ...cases[existingIndex],
      lastModified: Date.now(),
      patientData,
      diagnoses,
      chatHistory // Update chat history
    };
    cases[existingIndex] = newCase;
  } else {
    // Create new
    newCase = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      lastModified: Date.now(),
      patientData,
      diagnoses,
      chatHistory
    };
    cases.push(newCase);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(cases));
  return newCase;
};

export const getCases = (): SavedCase[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored).sort((a: SavedCase, b: SavedCase) => b.lastModified - a.lastModified);
  } catch (e) {
    return [];
  }
};

export const deleteCase = (id: string) => {
  const cases = getCases().filter(c => c.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cases));
};