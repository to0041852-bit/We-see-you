export interface SocialProfile {
  platform: "Facebook" | "Instagram" | "YouTube";
  url: string;
  confidence: "High" | "Medium" | "Low" | "None";
}

export interface AnalysisResult {
  identified: boolean;
  name: string;
  confidence: "High" | "Medium" | "Low" | "None";
  bio: string;
  reasoning: string;
  profiles: SocialProfile[];
  searchSuggestions: string[];
}

export interface GroundingSource {
  title: string;
  url: string;
}

export interface AnalyzeResponse {
  result: AnalysisResult;
  sources: GroundingSource[];
  error?: string;
}

export interface PresetPerson {
  id: string;
  name: string;
  role: string;
  imageAlt: string;
  sampleHelperText: string;
  imageUrl: string; // Base64 or high-quality illustration link
  mockResult: AnalysisResult;
  mockSources: GroundingSource[];
}
