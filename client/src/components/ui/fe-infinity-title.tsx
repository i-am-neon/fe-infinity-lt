import React from "react";

interface FeInfinityTitleProps {
    className?: string;
    size?: "sm" | "md" | "lg" | "xl";
}

/**
 * A component for rendering the "FE Infinity" title with the correct Metamorphous font.
 * Use this component wherever the product name appears for consistent styling.
 */
export function FeInfinityTitle({
    className = "",
    size = "md"
}: FeInfinityTitleProps) {
    const sizeClasses = {
        sm: "text-xl",
        md: "text-2xl",
        lg: "text-3xl",
        xl: "text-4xl"
    };

    return (
        <h1
            className={`font-bold font-metamorphous ${sizeClasses[size]} ${className}`}
        >
            FE Infinity
        </h1>
    );
} 