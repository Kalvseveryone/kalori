import React, { useState, useRef } from 'react';
import { Camera, Upload } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

const FoodScanner = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Simulasi analisis gambar
  const analyzeFoodImage = (image) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          calories: Math.floor(Math.random() * 500) + 100,
          protein: Math.floor(Math.random() * 30) + 5,
          confidence: (Math.random() * 30 + 70).toFixed(1)
        });
      }, 1500);
    });
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setLoading(true);
      const reader = new FileReader();
      reader.onloadend = async () => {
        setSelectedImage(reader.result);
        const result = await analyzeFoodImage(reader.result);
        setAnalysis(result);
        setLoading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const videoElement = document.createElement('video');
      const canvasElement = document.createElement('canvas');
      
      videoElement.srcObject = stream;
      await videoElement.play();
      
      canvasElement.width = videoElement.videoWidth;
      canvasElement.height = videoElement.videoHeight;
      
      const context = canvasElement.getContext('2d');
      context.drawImage(videoElement, 0, 0);
      
      const imageDataUrl = canvasElement.toDataURL('image/jpeg');
      
      stream.getTracks().forEach(track => track.stop());
      
      setSelectedImage(imageDataUrl);
      setLoading(true);
      const result = await analyzeFoodImage(imageDataUrl);
      setAnalysis(result);
      setLoading(false);
    } catch (error) {
      alert('Tidak dapat mengakses kamera. Pastikan Anda memberikan izin kamera.');
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setAnalysis(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-2xl mx-auto space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Food Scanner</CardTitle>
            <CardDescription>
              Unggah gambar makanan untuk menganalisis kandungan kalori dan protein
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!selectedImage ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    ref={fileInputRef}
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center justify-center gap-2 p-4 border-2 border-dashed rounded-lg hover:bg-gray-50"
                  >
                    <Upload className="w-6 h-6" />
                    <span>Unggah Gambar</span>
                  </button>
                  <button
                    onClick={handleCameraCapture}
                    className="flex items-center justify-center gap-2 p-4 border-2 border-dashed rounded-lg hover:bg-gray-50"
                  >
                    <Camera className="w-6 h-6" />
                    <span>Gunakan Kamera</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative">
                  <img
                    src={selectedImage}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                      <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
                    </div>
                  )}
                </div>
                
                {analysis && (
                  <Alert className="bg-green-50">
                    <AlertDescription>
                      <div className="space-y-2">
                        <div className="font-semibold">Hasil Analisis:</div>
                        <div>Kalori: {analysis.calories} kcal</div>
                        <div>Protein: {analysis.protein}g</div>
                        <div>Tingkat Akurasi: {analysis.confidence}%</div>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
                
                <button
                  onClick={handleReset}
                  className="w-full p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Scan Gambar Baru
                </button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FoodScanner;
