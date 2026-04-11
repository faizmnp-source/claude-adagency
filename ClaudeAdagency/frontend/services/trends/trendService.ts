export interface TrendSignal {
  trending_hooks: string[];
  trending_formats: string[];
  trending_keywords: string[];
  emotional_angles: string[];
  recommended_style: string;
}

export const fetchTrendInsights = async (category: string): Promise<TrendSignal> => {
  // Mocking trend data for the last 7 days
  console.log('Fetching trends for:', category);
  
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return {
    trending_hooks: [
      "I was today years old when I found out...",
      "POV: You finally found the solution to [Problem]",
      "3 things I wish I knew before starting [Activity]"
    ],
    trending_formats: [
      "Split-screen comparison",
      "Fast-paced vlog style",
      "ASMR product unboxing"
    ],
    trending_keywords: [
      "Game-changer",
      "Life-hack",
      "Aesthetic",
      "Must-have"
    ],
    emotional_angles: [
      "Relief from daily stress",
      "Aspiration for a better lifestyle",
      "FOMO (Fear of missing out)"
    ],
    recommended_style: "Authentic, low-fi vlog style with high-quality product inserts."
  };
};
