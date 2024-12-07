import React from 'react';
import { Clock, ChevronDown, ChevronUp } from 'lucide-react';
import type { IdentificationHistory } from '../types';

interface HistoryProps {
  history: IdentificationHistory[];
}

export const History: React.FC<HistoryProps> = ({ history }) => {
  const [expandedId, setExpandedId] = React.useState<string | null>(null);

  if (history.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="text-green-600" size={24} />
        <h2 className="text-xl font-semibold">Recent Identifications</h2>
      </div>

      <div className="space-y-4">
        {history.map((item) => (
          <div
            key={item.id}
            className="border rounded-lg overflow-hidden"
          >
            <button
              onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.imageUrl}
                  alt={item.analysis.commonName}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="text-left">
                  <h3 className="font-medium">{item.analysis.commonName}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(item.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </div>
              {expandedId === item.id ? (
                <ChevronUp className="text-gray-400" />
              ) : (
                <ChevronDown className="text-gray-400" />
              )}
            </button>

            {expandedId === item.id && (
              <div className="p-4 border-t bg-gray-50">
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Scientific Name: </span>
                    <span className="italic">{item.analysis.scientificName}</span>
                  </p>
                  <div>
                    <p className="text-sm font-medium mb-1">Characteristics:</p>
                    <ul className="list-disc list-inside text-sm text-gray-600">
                      {item.analysis.characteristics.map((char, index) => (
                        <li key={index}>{char}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-sm">
                      <span className="font-medium">Confidence: </span>
                      {Math.round(item.analysis.confidence * 100)}%
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};