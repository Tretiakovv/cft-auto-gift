"use client";

import { useState } from "react";
import { toast } from "sonner";
import { generateWish } from "../../api/generateWish";
import { handleGeneratePDF } from "../../utils/generatePdf";
import { Button } from "../ui/button";

export const GenerateBlock = () => {
    const [prompt, setPrompt] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = async () => {
        try {
            setIsLoading(true);

            const response = await generateWish(prompt);

            if (!response.ok) {
                throw new Error("Failed to generate wishes");
            }

            const { wishes, rateLimitHit } = await response.json();

            if (rateLimitHit) {
                toast.info("Обработали часть запроса, продолжаем далее");
            } else if (wishes?.length > 0) {
                await handleGeneratePDF(wishes.map((wish) => wish.wish));
            } else {
                toast.error("Не удалось сгенерировать поздравление");
            }
        } catch (err) {
            toast.error("Произошла ошибка при генерации");
            console.error('asasasas', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center space-y-4 w-full">
            <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Введите дополнительные пожелания"
                className="w-full min-w-[500px] min-h-[200px] p-4 rounded-2xl bg-white/10 backdrop-blur-md text-white placeholder-white/70 border-2 border-white/20 focus:border-white/40 focus:outline-none resize-none h-32"
            />

            <div className="w-full flex flex-row justify-between items-center">
                <p className="text-white/70 text-start text-sm">
                    Вводить промпт не обязательно! Можно сгенерировать поздравляши без промпта.
                </p>
                <Button
                    className="bg-white hover:bg-white text-black h-[52px] font-semibold px-10 rounded-[12px]"
                    onClick={handleGenerate}
                    disabled={isLoading}
                >
                    {isLoading ? "Генерация..." : "Сгенерировать"}
                </Button>
            </div>
        </div>
    );
};
