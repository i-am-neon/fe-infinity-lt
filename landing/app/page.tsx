import Image from "next/image";
import Link from "next/link";
import { GlowCard } from "@/components/ui/glow-card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      {/* Background gradient with hero content */}
      <div className="w-full">
        <BackgroundGradientAnimation>
          {/* Nav bar inside gradient */}
          <nav className="absolute top-0 left-0 right-0 flex w-full items-center justify-center px-6 py-4 z-50">
            <div className="ml-auto">
              <Link href="/downloads">
                <Button variant="ghost" className="text-white hover:bg-white/10">Downloads</Button>
              </Link>
            </div>
          </nav>

          {/* Hero content */}
          <div className="relative z-40 flex flex-col items-center justify-center py-32 pointer-events-none">
            <Image
              src="/logo.png"
              alt="FE Infinity Logo"
              width={120}
              height={120}
              className="mb-6"
            />
            <h1 className="text-5xl font-bold mb-6 text-center text-white" style={{ fontFamily: 'var(--font-metamorphous)' }}>
              FE Infinity
            </h1>
            <h2 className="text-2xl text-center mb-10 text-white">
              AI Creates a Fire Emblem game as you play it
            </h2>
          </div>
        </BackgroundGradientAnimation>
      </div>

      {/* Cards section */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 pt-12 pb-12">
        <div className="max-w-5xl w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Card 1 */}
            <GlowCard>
              <h3 className="text-xl font-bold mb-2">Dynamic Storytelling</h3>
              <p>Complete battle objectives, make decisions in dialogue, and watch as AI creates the next chapter based on your choices.</p>
            </GlowCard>

            {/* Card 2 */}
            <GlowCard>
              <h3 className="text-xl font-bold mb-2">Infinite Possibilities</h3>
              <p>No two playthroughs are alike. Your decisions shape unique stories, characters, and challenges each time you play.</p>
            </GlowCard>

            {/* Card 3 */}
            <GlowCard>
              <h3 className="text-xl font-bold mb-2">Classic Gameplay</h3>
              <p>Experience the tactical depth of Fire Emblem with the powerful Lex Talionis engine, enhanced with modern AI generation.</p>
            </GlowCard>
          </div>

          <div className="flex justify-center">
            <Link href="/downloads" className="inline-flex">
              <Button size="lg" className="text-lg gap-2">
                <Download size={24} />
                Download Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
