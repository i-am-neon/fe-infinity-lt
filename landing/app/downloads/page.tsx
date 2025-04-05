"use client";

import Image from "next/image";
import Link from "next/link";
import { GlowCard } from "@/components/ui/glow-card";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { Grid2x2, Apple } from "lucide-react";

export default function DownloadsPage() {
    return (
        <main className="flex min-h-screen flex-col items-center">
            {/* Nav bar */}
            <nav className="flex w-full items-center justify-center px-6 py-4">
                <Link href="/" className="flex items-center gap-2">
                    <Image
                        src="/logo.png"
                        alt="FE Infinity Logo"
                        width={48}
                        height={48}
                    />
                    <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-metamorphous)' }}>
                        FE Infinity
                    </h1>
                </Link>
                <div className="ml-auto">
                    {/* Home button removed */}
                </div>
            </nav>

            {/* Main content */}
            <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
                <div className="max-w-5xl w-full">
                    <h2 className="text-4xl font-bold text-center mb-12">
                        Download FE Infinity
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                        {/* Windows Download */}
                        <Link href="#windows-download" className="block h-full">
                            <GlowCard className="flex flex-col items-center justify-center text-center p-8 h-full transition-transform hover:scale-105">
                                <div className="mb-4">
                                    <Grid2x2 size={64} />
                                </div>
                                <h3 className="text-xl font-bold mb-4">Windows</h3>
                                <p>Works out of the box!</p>
                            </GlowCard>
                        </Link>

                        {/* Mac Download */}
                        <Link href="#mac-download" className="block h-full">
                            <GlowCard className="flex flex-col items-center justify-center text-center p-8 h-full transition-transform hover:scale-105">
                                <div className="mb-4">
                                    <Apple size={64} />
                                </div>
                                <h3 className="text-xl font-bold mb-4">Mac</h3>
                                <p>See below installation instructions</p>
                            </GlowCard>
                        </Link>
                    </div>

                    {/* Mac prerequisites */}
                    <div className="mt-12">
                        <h3 className="text-2xl font-bold mb-6">Mac Prerequisites</h3>
                        <p className="mb-4">Before installing FE Infinity on Mac, you'll need to install:</p>

                        <ol className="list-decimal pl-6 mb-6 space-y-2">
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
        <div className="bg-gray-800 rounded-lg p-4 mb-4 relative group">
            <pre className="font-mono text-sm text-white overflow-x-auto">{code}</pre>
            <div className="absolute right-2 top-2">
                <CopyButton text={code} />
            </div>
        </div>
    );
} 