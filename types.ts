export interface RefactorResult {
  refactoredCode: string;
  unitTests: string;
  explanation?: string;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  originalCode: string;
  refactorResult: RefactorResult | null;
  visualUrl: string | null;
  status: 'pending' | 'success' | 'error';
  error?: string;
}

export type TabOption = 'refactor' | 'tests' | 'visual';

export interface VisualGenerationResponse {
    imageUrl: string;
}
