"use client";

import React from "react";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { cn } from "@/lib/utils";

interface GlowCardProps {
    className?: string;
    children: React.ReactNode;
}

const GlowCard = ({ className, children }: GlowCardProps) => {
    return (
        <div className="relative h-full rounded-xl border p-1">
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

export { GlowCard }; 