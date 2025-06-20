"use client";

import Image from "next/image";
import { getAssetPrefix } from "../../utils/getAssetPrefix";

export const Hero = () => (
    <div className="flex flex-col">
        <div className="flex gap-4">
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
        <div className="w-[500px]">
            <h1 className="text-[80px] font-bold text-white">AutoGift</h1>
            <p className="text-2xl font-semibold text-white mb-8">
                Создай уникальные поздравляши <br/> в один клик 🎁
            </p>
        </div>
    </div>
);
