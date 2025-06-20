import { PropsWithChildren } from "react";
import { cn } from "../../lib/utils";

interface BlockProps extends PropsWithChildren {
    className?: string;
}

export const Block = ({ children, className }: BlockProps) => (
    <div className="w-full flex flex-col items-center">
        <div className={cn("w-[1300px]", className)}>{children}</div>
    </div>
);
