import React from 'react';
import { Leaf, Activity } from 'lucide-react';
import type { PlantAnalysis } from '../types';

interface AnalysisResultProps {
  analysis: PlantAnalysis;
}

export const AnalysisResult: React.FC<AnalysisResultProps> = ({ analysis }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <Leaf className="text-green-600" size={24} />
        <h2 className="text-2xl font-semibold">{analysis.commonName}</h2>
      </div>
      
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-500">Scientific Name</p>
          <p className="font-medium italic">{analysis.scientificName}</p>
        </div>
        
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Activity size={16} className="text-green-600" />
            <p className="text-sm text-gray-500">Confidence Score</p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-600 rounded-full h-2"
              style={{ width: `${analysis.confidence * 100}%` }}
            />
          </div>
        </div>
        
        <div>
          <p className="text-sm text-gray-500 mb-2">Characteristics</p>
          <ul className="list-disc list-inside space-y-1">
            {analysis.characteristics.map((char, index) => (
              <li key={index} className="text-gray-700">{char}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};