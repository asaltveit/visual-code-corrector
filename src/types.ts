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
  status: 'pending' | 'success' | 'error';
  error?: string;
  // Visual Verification fields
  isBackend?: boolean;
  visualBeforeUrl?: string | null;
  visualAfterUrl?: string | null;
}

export type TabOption = 'refactor' | 'tests' | 'visual' | 'sandbox';

export interface VisualGenerationResponse {
    imageUrl: string;
}
