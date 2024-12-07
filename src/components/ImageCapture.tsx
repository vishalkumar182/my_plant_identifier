import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Webcam from 'react-webcam';
import { Camera, Upload, X } from 'lucide-react';
import type { UploadMethod } from '../types';

interface ImageCaptureProps {
  onImageCapture: (imageData: string, method: UploadMethod) => void;
}

export const ImageCapture: React.FC<ImageCaptureProps> = ({ onImageCapture }) => {
  const [method, setMethod] = useState<UploadMethod>('file');
  const [preview, setPreview] = useState<string | null>(null);
  const webcamRef = useRef<Webcam>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        if (result) {
          setPreview(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setPreview(imageSrc);
    }
  };

  const handleSubmit = () => {
    if (preview) {
      onImageCapture(preview, method);
      setPreview(null);
    }
  };

  const handleClear = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-center gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setMethod('file')}
          className={`px-6 py-3 rounded-lg flex items-center gap-2 transition-colors ${
            method === 'file' ? 'bg-green-600 text-white' : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          <Upload size={20} />
          <span>Upload</span>
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setMethod('camera')}
          className={`px-6 py-3 rounded-lg flex items-center gap-2 transition-colors ${
            method === 'camera' ? 'bg-green-600 text-white' : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          <Camera size={20} />
          <span>Camera</span>
        </motion.button>
      </div>

      <AnimatePresence mode="wait">
        {method === 'file' ? (
          <motion.div
            key="file-upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center"
          >
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => fileInputRef.current?.click()}
              className="w-full max-w-md bg-white border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-green-500 transition-colors"
            >
              <Upload className="mx-auto mb-2 text-gray-400" size={24} />
              <p className="text-gray-600">Click to upload an image</p>
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="camera-capture"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center"
          >
            <Webcam
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              className="rounded-lg overflow-hidden shadow-lg"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCameraCapture}
              className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Capture Photo
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {preview && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative max-w-md mx-auto"
        >
          <img
            src={preview}
            alt="Preview"
            className="w-full rounded-lg shadow-lg"
          />
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleClear}
            className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md"
          >
            <X size={20} className="text-gray-600" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            className="mt-4 w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Analyze Plant
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};