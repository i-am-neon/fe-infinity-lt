"use client";

import { CopyButton } from "@/components/ui/copy-button";
import { GlowCard } from "@/components/ui/glow-card";
import { Apple, Grid2x2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function DownloadsPage() {
    return (
        <main className="flex min-h-screen flex-col items-center">
            {/* Nav bar */}
            <nav className="flex w-full items-center justify-center px-4 sm:px-6 py-3 sm:py-4">
                <Link href="/" className="flex items-center gap-2">
                    <Image
                        src="/logo.png"
                        alt="FE Infinity Logo"
                        width={40}
                        height={40}
                        className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12"
                    />
                    <h1 className="text-xl sm:text-2xl font-bold" style={{ fontFamily: 'var(--font-metamorphous)' }}>
                        FE Infinity
                    </h1>
                </Link>
                <div className="ml-auto">
                    {/* Home button removed */}
                </div>
            </nav>

            {/* Main content */}
            <div className="flex flex-1 flex-col items-center justify-center px-4 sm:px-6 py-6 sm:py-12">
                <div className="max-w-5xl w-full">
                    <h2 className="text-3xl sm:text-4xl font-bold text-center mb-6 sm:mb-12">
                        Download FE Infinity
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 mb-8 sm:mb-12">
                        {/* Windows Download */}
                        <Link href="#windows-download" className="block h-full">
                            <GlowCard className="flex flex-col items-center justify-center text-center p-5 sm:p-8 h-full transition-transform hover:scale-105">
                                <div className="mb-3 sm:mb-4">
                                    <Grid2x2 size={48} className="sm:w-16 sm:h-16" />
                                </div>
                                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-4">Windows</h3>
                                <p>Works out of the box!</p>
                            </GlowCard>
                        </Link>

                        {/* Mac Download */}
                        <a href="https://github.com/i-am-neon/fe-infinity-lt/releases/download/ai/FE.Infinity-1.0.0-arm64.dmg" className="block h-full">
                            <GlowCard className="flex flex-col items-center justify-center text-center p-5 sm:p-8 h-full transition-transform hover:scale-105">
                                <div className="mb-3 sm:mb-4">
                                    <Apple size={48} className="sm:w-16 sm:h-16" />
                                </div>
                                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-4">Mac</h3>
                                <p>See below installation instructions</p>
                            </GlowCard>
                        </a>
                    </div>

                    {/* Mac prerequisites */}
                    <div className="mt-8 sm:mt-12">
                        <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Mac Prerequisites</h3>
                        <p className="mb-3 sm:mb-4">Before installing FE Infinity on Mac, you&apos;ll need to install:</p>

                        <ol className="list-decimal pl-6 mb-4 sm:mb-6 space-y-1 sm:space-y-2">
                            <li>Homebrew: <a href="https://brew.sh" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">https://brew.sh</a></li>
                            <li>Python and Wine using Homebrew</li>
                        </ol>

                        <div className="relative">
                            <CodeBlock code={`/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`} />
                            <CodeBlock code="brew install python wine" />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

// Code block with copy button
function CodeBlock({ code }: { code: string }) {
    return (
        <div className="bg-gray-800 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4 relative group overflow-x-auto">
            <pre className="font-mono text-xs sm:text-sm text-white overflow-x-auto whitespace-pre-wrap break-all sm:break-normal">{code}</pre>
            <div className="absolute right-1 sm:right-2 top-1 sm:top-2">
                <CopyButton text={code} />
            </div>
        </div>
    );
} 