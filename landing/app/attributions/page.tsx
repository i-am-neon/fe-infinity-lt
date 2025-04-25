"use client";

import { BlurFade } from "@/components/magicui/blur-fade";
import { BLUR_FADE_DELAY } from "@/components/magicui/constants";
import { GlowCard } from "@/components/ui/glow-card";
import { Heart, Map } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const portraitCreators = [
    "Atey",
    "BatimaTheBat",
    "Blade",
    "BorsDeep",
    "BuskHusker",
    "CanDy",
    "Cravat",
    "Der",
    "GabrielKnight",
    "Ganondorf",
    "Garytop",
    "Ghostblade",
    "Goldblitzx",
    "Its_Just_Jay",
    "JeyTheCount",
    "JiroPaiPai",
    "Jopettajah",
    "Kanna",
    "LaurentLacroix",
    "LaurentLacroix, Levin64",
    "Lenh",
    "Levin64",
    "Lucky0426",
    "Marlon0024",
    "MeatofJustice",
    "Melia",
    "Memestaralbert",
    "Merpin",
    "MeteorSR23",
    "Mexicancactus2911",
    "MonkeyBard, Wasdye",
    "MrGreen3339",
    "NickT, Stitch",
    "Nickt",
    "Nobody",
    "Norikins",
    "Peerless",
    "Plant Academy",
    "Plant Academy, Levin",
    "Plant_Academy",
    "Quotedotlass, Ghostblade",
    "RedBean",
    "Redbean",
    "SaintRubenio",
    "Shadowfire",
    "SmokeyGuy77",
    "Spoon_Rhythm",
    "Spoon_Rhythm, Magelord Max",
    "Stitch",
    "TrezVG",
    "UltraFenix",
    "UltraFenix, BuskHusker, Obsidian Daddy, Lenh",
    "UltraFenix, Obsidian Daddy",
    "Wasdye",
    "flasuban",
    "h0lyMushrooms",
    "monk-han",
    "redlightning",
    "topazlight",
];

const mapCreators = [
    "Shin19",
    "FEU",
    "Aura_Wolf",
    "LordGlenn",
    "Legends of Avenir"
];

export default function AttributionsPage() {
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
                        {/* Empty div to maintain layout */}
                    </div>
                </nav>
            </BlurFade>

            {/* Main content */}
            <div className="flex flex-1 flex-col items-center justify-center px-4 sm:px-6 py-6 sm:py-12">
                <div className="w-full max-w-3xl sm:max-w-4xl md:max-w-5xl">
                    <BlurFade delay={BLUR_FADE_DELAY * 2} inView>
                        <h1 className="text-4xl sm:text-5xl font-bold text-center mb-6 sm:mb-8">
                            Attributions
                        </h1>

                        <div className="text-center mb-12 max-w-3xl mx-auto">
                            <p className="text-gray-200">
                                To create each chapter of your game, the AI chooses portraits and maps from the free-to-use assets available in the <Link href="https://github.com/Klokinator/FE-Repo" className="text-primary hover:text-primary/80 underline underline-offset-2" target="_blank" rel="noopener noreferrer">Fire Emblem Repository</Link>. These community-created resources help bring your unique story to life.
                            </p>
                        </div>
                    </BlurFade>

                    <BlurFade delay={BLUR_FADE_DELAY * 3} inView>
                        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-6">
                            Portrait Attributions
                        </h2>
                        <div className="flex items-center justify-center mb-6 sm:mb-10">
                            <Heart className="mr-2 text-red-500" />
                            <p className="text-center text-lg text-gray-200">
                                Thanks to these talented artists who created the portraits used in FE Infinity
                            </p>
                        </div>
                    </BlurFade>

                    <BlurFade delay={BLUR_FADE_DELAY * 4} inView>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                            {portraitCreators.map((creator, index) => (
                                <GlowCard
                                    key={index}
                                    className="p-4 sm:p-5 text-center transition-transform hover:scale-105"
                                >
                                    <p className="font-medium text-lg">{creator}</p>
                                </GlowCard>
                            ))}
                        </div>
                    </BlurFade>

                    <BlurFade delay={BLUR_FADE_DELAY * 5} inView>
                        <h2 className="text-2xl sm:text-3xl font-bold text-center mt-16 mb-4 sm:mb-6">
                            Map Attributions
                        </h2>
                        <div className="flex items-center justify-center mb-6 sm:mb-10">
                            <Map className="mr-2 text-blue-500" />
                            <p className="text-center text-lg text-gray-200">
                                Maps and tilesets used in FE Infinity
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                            {mapCreators.map((creator, index) => (
                                <GlowCard
                                    key={index}
                                    className="p-4 sm:p-5 text-center transition-transform hover:scale-105"
                                >
                                    <p className="font-medium text-lg">{creator}</p>
                                </GlowCard>
                            ))}
                        </div>
                    </BlurFade>

                    <BlurFade delay={BLUR_FADE_DELAY * 6} inView>
                        <div className="mt-12 text-center">
                            <p className="text-gray-300 mb-4">
                                FE Infinity uses these designs to represent characters and environments in the game.
                                All assets are from freely available community sources.
                            </p>
                            <Link href="/" className="text-primary hover:text-primary/80 underline underline-offset-2">
                                Return to Home
                            </Link>
                        </div>
                    </BlurFade>
                </div>
            </div>
        </main>
    );
}