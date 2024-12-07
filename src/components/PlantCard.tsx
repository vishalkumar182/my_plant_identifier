import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Info } from 'lucide-react';
import type { PlantAnalysis } from '../types';

interface PlantCardProps {
  plant: PlantAnalysis;
  image?: string;
}

export const PlantCard: React.FC<PlantCardProps> = ({ plant, image }) => {
  const [showInfo, setShowInfo] = React.useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden"
    >
      {image && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={image}
            alt={plant.commonName}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="text-green-500" size={20} />
            <h3 className="text-xl font-semibold text-gray-800">{plant.commonName}</h3>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowInfo(!showInfo)}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <Info size={20} className="text-gray-600" />
          </motion.button>
        </div>

        <motion.div
          initial={false}
          animate={{ height: showInfo ? 'auto' : 0, opacity: showInfo ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="pt-4 space-y-3">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Scientific Name: </span>
              <span className="italic">{plant.scientificName}</span>
            </p>
            
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Characteristics:</p>
              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                {plant.characteristics.map((char, index) => (
                  <li key={index}>{char}</li>
                ))}
              </ul>
            </div>

            <div className="pt-2">
              <p className="text-sm text-gray-600 mb-1">Confidence Score</p>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${plant.confidence * 100}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="h-full bg-green-500"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {Math.round(plant.confidence * 100)}% confident
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};