import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

interface QuoteCardProps {
  quote: string;
  author: string;
}

export const QuoteCard: React.FC<QuoteCardProps> = ({ quote, author }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg"
    >
      <div className="flex gap-4">
        <Quote className="text-green-500 flex-shrink-0" size={24} />
        <div>
          <p className="text-gray-700 dark:text-gray-300 italic">{quote}</p>
          <p className="text-gray-500 dark:text-gray-400 mt-2">- {author}</p>
        </div>
      </div>
    </motion.div>
  );
};