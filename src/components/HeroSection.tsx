import { Button } from "@/components/ui/button";
import { Mic, Sparkles, TrendingUp } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-hero min-h-screen flex items-center">
      <div className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              AI-Powered Pitch Optimization
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent leading-tight">
              Transform Your Idea Into a 
              <span className="block">Perfect Pitch</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-lg">
              Record your startup idea and get an optimized one-liner plus a complete pitch deck structure based on Guy Kawasaki's proven formula.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button variant="hero" size="lg" className="group">
                <Mic className="w-5 h-5 group-hover:animate-pulse" />
                Start Recording
              </Button>
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </div>
            
            <div className="flex items-center gap-8 mt-12 justify-center lg:justify-start">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">500+</div>
                <div className="text-sm text-muted-foreground">Pitches Optimized</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">98%</div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">2min</div>
                <div className="text-sm text-muted-foreground">Average Time</div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-card">
              <img 
                src={heroImage} 
                alt="Audio waves transforming into pitch deck slides"
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-secondary/20"></div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 bg-accent text-accent-foreground p-3 rounded-xl shadow-elegant animate-bounce">
              <TrendingUp className="w-6 h-6" />
            </div>
            
            <div className="absolute -bottom-4 -left-4 bg-primary text-primary-foreground p-3 rounded-xl shadow-glow animate-pulse">
              <Sparkles className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;