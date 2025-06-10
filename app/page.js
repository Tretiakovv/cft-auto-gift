'use client';

import { useRef, useState } from 'react';
import { handleGeneratePDF } from '../utils/generatePdf';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleClick = async () => {
    try {
      setError(null);
      setIsLoading(true);
      const file = fileInputRef.current?.files?.[0];
      
      if (!file) {
        setError('Пожалуйста, выберите Excel файл');
        return;
      }

      // Convert Excel file to base64
      const base64Data = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64String = reader.result.split(',')[1];
          resolve(base64String);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      // Call the API route
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ excelData: base64Data }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate wishes');
      }

      const { wishes } = await response.json();

      if (wishes?.length > 0) {
        await handleGeneratePDF(wishes.map(wish => wish.wish));
      } else {
        setError('Не найдено именинников или юбиляров в текущем месяце');
      }
    } catch (err) {
      setError('Произошла ошибка при обработке файла');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="text-center space-y-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6 animate-fade-in">
          Сгенерировать поздравляши
        </h1>
        
        <div className="flex flex-col items-center space-y-4">
          <input
            type="file"
            accept=".xlsx,.xls"
            ref={fileInputRef}
            className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100"
          />
          
          <button
            onClick={handleClick}
            disabled={isLoading}
            className={`px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold
                     transform transition-all duration-200 
                     ${!isLoading ? 'hover:scale-105 hover:bg-blue-700' : 'opacity-75 cursor-not-allowed'}
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                     shadow-lg hover:shadow-xl
                     inline-flex items-center justify-center min-w-[200px]`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Генерация...
              </>
            ) : (
              'Начать генерацию'
            )}
          </button>
          
          {error && (
            <div className="text-red-600 mt-2">
              {error}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
