'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Toaster, toast } from 'sonner';
import { Button } from '../components/ui/button';
import { handleGeneratePDF } from '../utils/generatePdf';
import { getAssetPrefix } from '../utils/getAssetPrefix';
import styles from './page.module.css';
import OpenAI from 'openai';

const token = process.env.NEXT_PUBLIC_API_KEY;
const endpoint = "https://models.github.ai/inference";
const model = "openai/gpt-4o";

const client = new OpenAI({ baseURL: endpoint, apiKey: token, dangerouslyAllowBrowser: true });

function Home() {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    alert(process.env.NEXT_PUBLIC_API_KEY);
  }, [ ])

  const handleGenerate = async () => {
    try {
      setError(null);
      setIsLoading(true);

      // Call the API route
      const response = await fetch('/api/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to generate wishes');
      }

      const { wishes } = await response.json();

      if (wishes?.length > 0) {
        await handleGeneratePDF(wishes.map(wish => wish.wish));
      } else {
        toast.error('Не удалось сгенерировать поздравление');
      }
    } catch (err) {
      toast.error('Произошла ошибка при генерации');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className={`min-h-screen flex flex-col items-center justify-center ${styles.shimmeringBackground} p-4`}>
      <Toaster visibleToasts={1} position="bottom-right" />
      <div className="flex gap-4 mb-4">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4">
          <Image
            src={getAssetPrefix() + "/images/korona-logo.png"}
            alt="Korona Logo"
            width={150}
            height={40}
            className="h-10 w-auto"
          />
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4">
          <Image
            src={getAssetPrefix() + "/images/webtech-logo.png"}
            alt="Webtech Department Logo"
            width={150}
            height={40}
            className="h-10 w-auto"
          />
        </div>
      </div>

      <div className="text-center">
        <h1 className="text-[80px] font-bold text-white mb-2">
          AutoGift
        </h1>
        <p className="text-2xl font-semibold text-white mb-8">
          Создай уникальные поздравляши<br />в один клик 🎁
        </p>
        
        <div className="flex flex-col items-center space-y-4 max-w-xl w-full mx-auto">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Введите дополнительные пожелания"
            className="w-full p-4 rounded-2xl bg-white/10 backdrop-blur-md text-white placeholder-white/70 border-2 border-white/20 focus:border-white/40 focus:outline-none resize-none h-32"
          />

          <div className='w-full flex flex-row justify-between items-center'>
          <p className="text-white/70 text-start text-sm">
            Вводить промпт не обязательно! Можно сгенерировать поздравляши без промпта.
          </p>
          
          <Button
            className='bg-white hover:bg-white text-black h-[52px] font-semibold px-10 rounded-[12px]'
            onClick={handleGenerate}
            disabled={isLoading}
          >
            {isLoading ? 'Генерация...' : 'Сгенерировать'}
          </Button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Home;