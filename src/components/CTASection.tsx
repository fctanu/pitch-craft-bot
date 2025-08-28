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
          Join hundreds of founders who've already optimized their pitches and raised funding faster.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="cta" size="lg" className="group bg-background text-foreground hover:bg-background/90">
            <Mic className="w-5 h-5 group-hover:animate-pulse" />
            Start Your First Pitch
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
          
          <Button variant="outline" size="lg" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
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
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 rounded-full bg-primary-foreground animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 rounded-full bg-accent animate-bounce"></div>
        <div className="absolute top-1/2 left-1/2 w-16 h-16 rounded-full bg-primary-foreground animate-ping"></div>
      </div>
    </section>
  );
};

export default CTASection;