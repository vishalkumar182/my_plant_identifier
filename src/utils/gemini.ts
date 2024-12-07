import { GoogleGenerativeAI } from '@google/generative-ai';
import type { PlantAnalysis } from '../types';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function analyzePlantImage(imageData: string): Promise<PlantAnalysis> {
  try {
    if (!import.meta.env.VITE_GEMINI_API_KEY) {
      throw new Error('Gemini API key is not configured');
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
    
    // Remove data URL prefix if present
    const base64Data = imageData.includes('base64,') 
      ? imageData.split('base64,')[1] 
      : imageData;

    // Validate base64 data
    if (!base64Data || base64Data.length === 0) {
      throw new Error('Invalid image data provided');
    }

    const parts = [
      {
        text: `Analyze this plant image and provide the following information in a structured format:
        Common name:
        Scientific name:
        Characteristics:
        Confidence: (high/medium/low)
        
        Please ensure all fields are filled with appropriate values. If you cannot identify the plant with certainty, indicate this in the confidence level.`
      },
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: base64Data
        }
      }
    ];

    const result = await model.generateContent(parts);
    const response = await result.response;
    const text = response.text();

    if (!text) {
      throw new Error('No analysis results received from the API');
    }

    const analysis = parseGeminiResponse(text);
    
    // Validate the parsed response
    if (!analysis.commonName || !analysis.scientificName) {
      throw new Error('Incomplete analysis results received');
    }

    return analysis;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    console.error('Error analyzing image:', { message: errorMessage });
    throw new Error(`Failed to analyze plant image: ${errorMessage}`);
  }
}

function parseGeminiResponse(text: string): PlantAnalysis {
  try {
    const lines = text.split('\n').filter(line => line.trim());
    
    let commonName = "";
    let scientificName = "";
    let characteristics: string[] = [];
    let confidence = 0.7; // Default medium confidence

    for (const line of lines) {
      const [key, ...valueParts] = line.split(':');
      const value = valueParts.join(':').trim();

      if (!key || !value) continue;

      switch (key.toLowerCase().trim()) {
        case 'common name':
          commonName = value;
          break;
        case 'scientific name':
          scientificName = value;
          break;
        case 'characteristics':
          characteristics = value
            .split(',')
            .map(c => c.trim())
            .filter(c => c.length > 0);
          break;
        case 'confidence':
          confidence = value.toLowerCase().includes('high') ? 0.9 
            : value.toLowerCase().includes('low') ? 0.5 
            : 0.7;
          break;
      }
    }

    // If any required field is missing, provide default values
    return {
      commonName: commonName || "Unknown Plant",
      scientificName: scientificName || "Species unknown",
      characteristics: characteristics.length ? characteristics : ['Plant characteristics could not be determined'],
      confidence: confidence
    };
  } catch (error) {
    console.error('Error parsing Gemini response:', error);
    throw new Error('Failed to parse plant analysis results');
  }
}