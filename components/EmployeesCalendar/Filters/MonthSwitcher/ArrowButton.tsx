"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { HTMLAttributes } from "react";

interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
    disabled?: boolean;
    position: "left" | "right";
}

export const ArrowButton = ({ position, ...props }: ButtonProps) => (
    <Button
        variant="outline"
        size="icon"
        className="rounded-full w-10 h-10 !bg-white/20 border-none shadow-none"
        {...props}
    >
        {position === "left" ? (
            <ChevronLeft className="size-7 text-white" />
        ) : (
            <ChevronRight className="size-7 text-white" />
        )}
    </Button>
);
