import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageCapture } from '../components/ImageCapture';
import { PlantCard } from '../components/PlantCard';
import { History } from '../components/History';
import { ContactSection } from '../components/ContactSection';
import { QuoteCard } from '../components/QuoteCard';
import { ThemeToggle } from '../components/ThemeToggle';
import { analyzePlantImage } from '../utils/gemini';
import { saveToHistory, getHistory } from '../utils/storage';
import { plantQuotes } from '../data/quotes';
import { Sprout, Leaf } from 'lucide-react';
import type { PlantAnalysis, UploadMethod } from '../types';

export const Home: React.FC = () => {
  const [analyzing, setAnalyzing] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<PlantAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const randomQuote = plantQuotes[Math.floor(Math.random() * plantQuotes.length)];

  const handleImageCapture = async (imageData: string, method: UploadMethod) => {
    try {
      setAnalyzing(true);
      setError(null);
      setCurrentImage(imageData);
      setAnalysis(null);
      
      const result = await analyzePlantImage(imageData);
      
      if (!result || !result.commonName) {
        throw new Error('Invalid analysis result received');
      }
      
      setAnalysis(result);
      
      saveToHistory({
        id: Date.now().toString(),
        timestamp: Date.now(),
        imageUrl: imageData,
        analysis: result
      });
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'An unexpected error occurred while analyzing the image';
      setError(errorMessage);
      console.error('Error during analysis:', { message: errorMessage });
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-200">
      <header className="bg-white dark:bg-gray-800 shadow-sm transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3"
            >
              <Sprout className="text-green-600" size={32} />
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Plant Identifier</h1>
            </motion.div>
            <ThemeToggle />
          </div>
          <p className="mt-2 text-gray-600 dark:text-gray-300 max-w-2xl">
            Discover the fascinating world of plants! Upload or capture a photo of any plant, 
            and our AI-powered system will help you identify and learn more about it.
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <QuoteCard quote={randomQuote.quote} author={randomQuote.author} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-colors duration-200"
        >
          <ImageCapture onImageCapture={handleImageCapture} />
          
          <AnimatePresence mode="wait">
            {analyzing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center mt-6"
              >
                <div className="flex items-center justify-center gap-3">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Leaf className="text-green-600" size={24} />
                  </motion.div>
                  <p className="text-gray-600 dark:text-gray-300">Analyzing your plant...</p>
                </div>
              </motion.div>
            )}
            
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-6 p-4 bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 
                         text-red-600 dark:text-red-300 rounded-lg"
              >
                {error}
              </motion.div>
            )}
            
            {analysis && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-6"
              >
                <PlantCard plant={analysis} image={currentImage || undefined} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <History history={getHistory()} />
        <ContactSection />
      </main>
    </div>
  );
};