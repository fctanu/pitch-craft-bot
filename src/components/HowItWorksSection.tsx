import { Mic, Brain, FileText } from "lucide-react";

const steps = [
  {
    icon: Mic,
    title: "Record Your Idea",
    description: "Simply speak about your startup idea naturally. Our advanced audio processing captures every detail.",
    color: "text-primary"
  },
  {
    icon: Brain,
    title: "AI Analysis",
    description: "Our AI transcribes and analyzes your pitch using Guy Kawasaki's proven framework for maximum impact.",
    color: "text-accent"
  },
  {
    icon: FileText,
    title: "Get Results",
    description: "Receive an optimized one-liner and complete pitch deck structure ready for investors.",
    color: "text-primary-glow"
  }
];

const HowItWorksSection = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transform your raw idea into a compelling pitch in just three simple steps
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              <div className="bg-gradient-card rounded-2xl p-8 shadow-card hover:shadow-elegant transition-smooth group-hover:scale-105">
                <div className={`w-16 h-16 rounded-xl bg-gradient-primary flex items-center justify-center mb-6 group-hover:shadow-glow transition-smooth`}>
                  <step.icon className="w-8 h-8 text-primary-foreground" />
                </div>
                
                <h3 className="text-xl font-semibold mb-4">
                  {step.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
                
                {/* Step number */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-accent text-accent-foreground rounded-full flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </div>
              </div>
              
              {/* Connecting line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-px bg-gradient-primary transform -translate-y-1/2 z-10"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;