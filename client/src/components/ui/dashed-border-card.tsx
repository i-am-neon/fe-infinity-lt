"use client";

import React from "react";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { cn } from "@/lib/utils";

interface DashedBorderCardProps {
    className?: string;
    children: React.ReactNode;
}

const DashedBorderCard = ({ className, children }: DashedBorderCardProps) => {
    return (
        <div className="relative h-full rounded-xl border-2 border-dashed p-1">
            <GlowingEffect
                spread={40}
                glow={true}
                disabled={false}
                proximity={64}
                inactiveZone={0.01}
            />
            <div className={cn("relative h-full rounded-lg p-4", className)}>
                {children}
            </div>
        </div>
    );
};

export { DashedBorderCard }; 