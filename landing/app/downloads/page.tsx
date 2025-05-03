"use client";

import { BlurFade } from "@/components/magicui/blur-fade";
import { BLUR_FADE_DELAY } from "@/components/magicui/constants";
import { ScriptCopyBtn } from "@/components/magicui/script-copy-btn";
import { GlowCard } from "@/components/ui/glow-card";
import { Apple, Grid2x2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const MAC_DOWNLOAD_LINK = "https://github.com/i-am-neon/fe-infinity-lt/releases/download/1.0.0/FE.Infinity-1.0.0-arm64.dmg";
const WINDOWS_DOWNLOAD_LINK = "https://github.com/i-am-neon/fe-infinity-lt/releases/download/1.0.0/FE.Infinity-Setup-1.0.0.exe";

export default function DownloadsPage() {
    return (
        <main className="flex min-h-screen flex-col items-center">
            {/* Nav bar */}
            <BlurFade delay={BLUR_FADE_DELAY}>
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
            </BlurFade>

            {/* Main content */}
            <div className="flex flex-1 flex-col items-center justify-center px-4 sm:px-6 py-6 sm:py-12">
                <div className="w-full max-w-3xl sm:max-w-4xl md:max-w-5xl">
                    <BlurFade delay={BLUR_FADE_DELAY * 2} inView>
                        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-6 sm:mb-12">
                            Download FE Infinity
                        </h2>
                    </BlurFade>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 mb-8 sm:mb-12">
                        {/* Windows Download */}
                        <BlurFade delay={BLUR_FADE_DELAY * 3} inView>
                            <Link href={WINDOWS_DOWNLOAD_LINK} className="block h-full">
                                <GlowCard className="flex flex-col items-center justify-center text-center p-5 sm:p-8 h-full transition-transform hover:scale-105">
                                    <div className="mb-3 sm:mb-4">
                                        <Grid2x2 size={48} className="sm:w-16 sm:h-16" />
                                    </div>
                                    <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-4">Windows</h3>
                                    <p>Works out of the box!</p>
                                </GlowCard>
                            </Link>
                        </BlurFade>

                        {/* Mac Download */}
                        <BlurFade delay={BLUR_FADE_DELAY * 4} inView>
                            <a href={MAC_DOWNLOAD_LINK} className="block h-full">
                                <GlowCard className="flex flex-col items-center justify-center text-center p-5 sm:p-8 h-full transition-transform hover:scale-105">
                                    <div className="mb-3 sm:mb-4">
                                        <Apple size={48} className="sm:w-16 sm:h-16" />
                                    </div>
                                    <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-4">Mac</h3>
                                    <p>See below installation instructions</p>
                                </GlowCard>
                            </a>
                        </BlurFade>
                    </div>

                    {/* Mac prerequisites */}
                    <BlurFade delay={BLUR_FADE_DELAY * 5} inView>
                        <div className="mt-8 sm:mt-12">
                            <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Mac Prerequisites</h3>
                            <p className="mb-5 sm:mb-6">Before installing FE Infinity on Mac, you&apos;ll need to install some prerequisites:</p>

                            <div className="space-y-8 mb-6">
                                {/* Homebrew */}
                                <BlurFade delay={BLUR_FADE_DELAY * 6} inView>
                                    <div>
                                        <h4 className="text-lg font-medium mb-2">
                                            1. Install <Link href="https://brew.sh" className="underline underline-offset-2 hover:text-primary" target="_blank" rel="noopener noreferrer">Homebrew</Link>
                                        </h4>
                                        <p className="mb-3 text-gray-300">Homebrew is a package manager for macOS that makes it easy to install software.</p>
                                        <div className="w-full max-w-[calc(100vw-40px)] md:max-w-none overflow-hidden">
                                            <ScriptCopyBtn
                                                className="w-full max-w-full"
                                                commandMap={{ zsh: `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"` }}
                                                codeLanguage="sh"
                                                lightTheme="github-dark"
                                                darkTheme="github-dark"
                                                showMultiplePackageOptions={false}
                                            />
                                        </div>
                                    </div>
                                </BlurFade>

                                {/* Python and Wine */}
                                <BlurFade delay={BLUR_FADE_DELAY * 7} inView>
                                    <div>
                                        <h4 className="text-lg font-medium mb-2">
                                            2. Install <Link href="https://www.python.org/" className="underline underline-offset-2 hover:text-primary" target="_blank" rel="noopener noreferrer">Python</Link> and <Link href="https://www.winehq.org/" className="underline underline-offset-2 hover:text-primary" target="_blank" rel="noopener noreferrer">Wine</Link>
                                        </h4>
                                        <p className="mb-3 text-gray-300">Python is needed for running the game engine, and Wine allows running Windows applications on macOS.</p>
                                        <div className="w-full max-w-[calc(100vw-40px)] md:max-w-none overflow-hidden">
                                            <ScriptCopyBtn
                                                className="w-full max-w-full"
                                                commandMap={{ zsh: "brew install python wine" }}
                                                codeLanguage="sh"
                                                lightTheme="github-dark"
                                                darkTheme="github-dark"
                                                showMultiplePackageOptions={false}
                                            />
                                        </div>
                                    </div>
                                </BlurFade>
                            </div>
                        </div>
                    </BlurFade>
                </div>
            </div>
        </main>
    );
} 