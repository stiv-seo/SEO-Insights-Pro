export interface SeoAnalysisResult {
  url: string;
  technology: string;
  seoScore: number;
  seoJustification: string;
  suggestedFixes: string;
  simulatedScrapedContent: string;
}

export interface SeoAnalysisError {
  error: string;
  message: string;
}
