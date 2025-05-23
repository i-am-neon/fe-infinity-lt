import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";
import { Button } from "@/components/ui/button";
import { Clock, DollarSign, Download, Gamepad2, Github, MessageSquare, Palette, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import HeroVideoDialog from "@/components/magicui/hero-video-dialog";
import { BlurFade } from "@/components/magicui/blur-fade";
import { BLUR_FADE_DELAY } from "@/components/magicui/constants";

const features = [
  {
    name: "Not Free, But Very Cheap",
    description: "Each chapter costs less than a penny to generate through OpenAI's API. OpenAI charges your credit card directly based on usage — FE Infinity takes no cut. You control your OpenAI account, so there are no hidden fees or markups.",
    icon: DollarSign,
  },
  {
    name: "Infinite Possibilities",
    description: "Complete battle objectives, make decisions in dialogue, and watch as AI creates the next chapter based on your choices. No two playthroughs are alike – your decisions shape unique stories, characters, and challenges each time you play.",
    icon: Sparkles,
  },
  {
    name: "Classic Gameplay",
    description: "Experience the tactical depth of Fire Emblem with the powerful ",
    icon: Gamepad2,
    customDescription: true,
  },
  {
    name: "Quick Generation",
    description: "Experience minimal waiting with chapters generated in approximately 2 minutes, keeping your gameplay flowing.",
    icon: Clock,
  },
  {
    name: "Open Source",
    description: "FE Infinity is completely open source and free to use/modify/steal. Contribute to or customize the project to suit your needs.",
    icon: Github,
    link: {
      href: "https://github.com/i-am-neon/fe-infinity-lt",
      text: "View on GitHub"
    }
  },
  {
    name: "Free-to-Use Assets",
    description: "FE Infinity uses free-to-use assets from the Fire Emblem repository, ensuring a classic feel while delivering a modern AI-driven experience.",
    icon: Palette,
    customDescription: true,
  },
];

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      {/* Background gradient with hero content */}
      <div className="w-full">
        <BackgroundGradientAnimation className="flex flex-col">
          {/* Nav bar inside gradient */}
          <nav className="absolute top-0 left-0 right-0 flex w-full items-center justify-center px-4 sm:px-6 py-3 sm:py-4 z-50">
            <BlurFade delay={BLUR_FADE_DELAY} className="ml-auto flex gap-2">
              <Link href="https://discord.gg/zkKjjRKeHk" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 gap-1 sm:gap-2 text-sm sm:text-base">
                  Join Discord
                </Button>
              </Link>
              <Link href="/downloads">
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 text-sm sm:text-base">Downloads</Button>
              </Link>
            </BlurFade>
          </nav>

          {/* Hero content */}
          <BlurFade delay={BLUR_FADE_DELAY * 2} className="flex-grow">
            <div className="relative z-40 flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] md:min-h-[calc(100vh-10rem)] px-4 py-16 sm:py-20 md:py-24 pointer-events-none">
              <Image
                src="/logo.png"
                alt="FE Infinity Logo"
                width={120}
                height={120}
                className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 mb-3 sm:mb-4 md:mb-6"
              />
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-4 md:mb-6 text-center text-white" style={{ fontFamily: 'var(--font-metamorphous)' }}>
                FE Infinity
              </h1>
              <h2 className="text-lg sm:text-xl md:text-2xl text-center mb-6 sm:mb-8 md:mb-10 text-white">
                AI Creates a Fire Emblem game as you play
              </h2>
              <div className="pointer-events-auto w-full max-w-xs sm:max-w-sm md:max-w-xl lg:max-w-3xl xl:max-w-4xl px-2 sm:px-4">
                <HeroVideoDialog
                  videoSrc="https://www.youtube.com/embed/aNEkzWAhJCk"
                  thumbnailSrc="/video-thumbnail.jpg"
                  thumbnailAlt="FE Infinity Gameplay Demo"
                  animationStyle="fade"
                  className="shadow-2xl rounded-lg transform hover:scale-[1.01] transition-all duration-300"
                />
              </div>
            </div>
          </BlurFade>
        </BackgroundGradientAnimation>
      </div>

      {/* Features section with new layout */}
      <div className="w-full py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <BlurFade delay={BLUR_FADE_DELAY * 3} inView>
            <div className="mx-auto max-w-2xl lg:text-center p-10">
              <h2 className="text-2xl font-semibold text-primary">Endless Adventures</h2>
              <p className="mt-2 text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6">
                An AI-Powered Fire Emblem Experience
              </p>
              <p className="mt-6 text-lg text-muted-foreground">
                Your game is created one chapter at a time. Once you complete a chapter, the AI creates the next one.
                The choices you make and the characters who die impact the story significantly.
              </p>
            </div>
          </BlurFade>

          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-5xl">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
              {features.map((feature, index) => (
                <BlurFade key={feature.name} delay={BLUR_FADE_DELAY * (index + 4)} inView>
                  <div className="relative pl-16">
                    <dt className="text-base font-semibold">
                      <div className="absolute top-0 left-0 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 via-violet-500 to-indigo-700 shadow-md">
                        <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                      </div>
                      {feature.name}
                    </dt>
                    <dd className="mt-2 text-base text-muted-foreground">
                      {feature.customDescription ? (
                        feature.name === "Free-to-Use Assets" ? (
                          <>
                            <p>
                              FE Infinity uses free-to-use assets from the <Link href="https://github.com/Klokinator/FE-Repo" className="underline underline-offset-2 hover:text-primary" target="_blank" rel="noopener noreferrer">Fire Emblem repository</Link>, ensuring a classic feel while delivering a modern AI-driven experience.
                            </p>
                            <div className="mt-2">
                              <Link href="/attributions">
                                <Button variant="outline" size="sm" className="gap-1">
                                  View Attributions
                                </Button>
                              </Link>
                            </div>
                          </>
                        ) : (
                          <p>
                            Experience the tactical depth of Fire Emblem with the powerful <Link href="https://lt-maker.readthedocs.io/en/latest/index.html" className="underline underline-offset-2 hover:text-primary" target="_blank" rel="noopener noreferrer">Lex Talionis engine</Link>, enhanced with modern AI generation.
                          </p>
                        )
                      ) : (
                        feature.description
                      )}
                      {feature.link && (
                        <div className="mt-2">
                          <Link href={feature.link.href} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" size="sm" className="gap-1">
                              {/* <Github size={14} /> */}
                              {feature.link.text}
                            </Button>
                          </Link>
                        </div>
                      )}
                    </dd>
                  </div>
                </BlurFade>
              ))}
            </dl>
          </div>


          <BlurFade delay={BLUR_FADE_DELAY * (features.length - 1)} inView>
            <div className="flex justify-center gap-4 mt-40">
              <Link href="/downloads" className="inline-flex">
                <Button size="lg" className="text-lg gap-2">
                  <Download size={24} />
                  Download Now
                </Button>
              </Link>
              <Link href="https://discord.gg/zkKjjRKeHk" target="_blank" rel="noopener noreferrer" className="inline-flex">
                <Button size="lg" variant="outline" className="text-lg gap-2">
                  <MessageSquare size={24} />
                  Join Discord
                </Button>
              </Link>
            </div>
          </BlurFade>
        </div>
      </div>
    </main>
  );
}
