import { Button } from "@/components/ui/button";
import { Mic } from "lucide-react";
import { Input } from "@/components/ui/input";

// Refactored layout to mirror design: left headline with highlighted words, right code-style preview card.
const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-hero min-h-[92vh] flex items-center pt-24">
      {/* Ambient background accents */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-24 w-[38rem] h-[38rem] bg-[radial-gradient(circle_at_30%_40%,hsl(262_72%_60%/.35),transparent_70%)]" />
        <div className="absolute bottom-0 right-0 w-[50rem] h-[50rem] bg-[radial-gradient(circle_at_70%_60%,hsl(200_90%_60%/.25),transparent_70%)]" />
      </div>
      <div className="container mx-auto px-4 relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left copy */}
          <div className="max-w-xl mx-auto lg:mx-0 text-center lg:text-left">
            <h1 className="font-bold tracking-tight text-4xl md:text-6xl leading-[1.05] mb-8">
              <span className="block">Transform</span>
              <span className="block">
                Your{" "}
                <span className="text-primary bg-gradient-primary bg-clip-text text-transparent">
                  Startup
                </span>
              </span>
              <span className="block">Idea into a</span>
              <span className="block">Winning Pitch</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-lg mx-auto lg:mx-0">
              Record your idea in your own words. Our AI turns it into a
              compelling one-liner and pitch deck structure based on Guy
              Kawasaki's proven formula.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto lg:mx-0">
              <Button
                variant="hero"
                size="lg"
                className="group flex-1 sm:flex-initial"
              >
                <Mic className="w-5 h-5 group-hover:animate-pulse" />
                Start Recording Now
              </Button>
              <div className="flex-1 hidden sm:block">
                <div className="h-11 rounded-md border border-border/70 bg-background/40 backdrop-blur-sm flex items-center px-4 text-sm text-muted-foreground ring-offset-background ring-1 ring-inset ring-border/50">
                  Coming soon...
                </div>
              </div>
            </div>
          </div>
          {/* Right preview card */}
          <div className="relative max-w-lg mx-auto w-full">
            <div className="rounded-2xl bg-card/70 backdrop-blur-xl ring-1 ring-border/60 shadow-elegant overflow-hidden">
              <div className="flex items-center gap-2 h-10 px-4 border-b border-border/50 bg-gradient-to-r from-background/60 to-background/20">
                <div className="flex gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500/70" />
                  <span className="w-3 h-3 rounded-full bg-amber-400/70" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/70" />
                </div>
                <span className="ml-2 text-xs uppercase tracking-wider text-muted-foreground">
                  Pitch Generator
                </span>
              </div>
              <div className="p-6 space-y-6 text-sm leading-relaxed">
                <div>
                  <div className="font-semibold mb-2 text-foreground/90">
                    One-liner:
                  </div>
                  <div className="rounded-md bg-background/60 p-4 border border-border/50 font-mono text-[13px] text-muted-foreground whitespace-pre-line">
                    "An AI-powered platform that transforms founders' spoken
                    ideas into polished pitch decks within minutes, saving
                    entrepreneurs hours of preparation."
                  </div>
                </div>
                <div>
                  <div className="font-semibold mb-2 text-foreground/90">
                    Pitch Structure:
                  </div>
                  <ul className="space-y-2 font-mono text-[13px] text-muted-foreground">
                    <li className="flex gap-2">
                      <span className="text-primary">•</span> Problem: Founders
                      spending hours refining pitches
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary">•</span> Solution:
                      AI-driven pitch generation from voice recordings
                    </li>
                    <li className="flex gap-2">
                      <span className="text-primary">•</span> Business Model:
                      Subscription tiers with usage levels
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            {/* Accent glow border */}
            <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-primary/30 pointer-events-none [mask:linear-gradient(#000,transparent_70%)]"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
