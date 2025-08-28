import { Button } from "@/components/ui/button";
import { Mic, ArrowRight } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-24 bg-gradient-primary relative overflow-hidden">
      <div className="container mx-auto px-4 text-center relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
          Ready to Perfect Your Pitch?
        </h2>

        <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
          Join hundreds of founders who've already optimized their pitches and
          raised funding faster.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="cta"
            size="lg"
            className="group bg-background text-foreground hover:bg-background/90"
          >
            <Mic className="w-5 h-5 group-hover:animate-pulse" />
            Start Your First Pitch
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
          >
            Watch Demo
          </Button>
        </div>

        <div className="mt-12 flex items-center justify-center gap-8 text-primary-foreground/60">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-accent rounded-full"></div>
            <span className="text-sm">No credit card required</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-accent rounded-full"></div>
            <span className="text-sm">Free first pitch</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-accent rounded-full"></div>
            <span className="text-sm">2-minute setup</span>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[60rem] h-[60rem] bg-[radial-gradient(circle,hsl(226_85%_64%/.18),transparent_70%)]" />
        <div className="absolute -bottom-20 -left-10 w-[40rem] h-[40rem] bg-[radial-gradient(circle_at_30%_70%,hsl(200_90%_60%/.15),transparent_70%)]" />
        <div className="absolute -top-20 -right-10 w-[40rem] h-[40rem] bg-[radial-gradient(circle_at_70%_30%,hsl(262_72%_60%/.12),transparent_70%)]" />
      </div>
    </section>
  );
};

export default CTASection;
