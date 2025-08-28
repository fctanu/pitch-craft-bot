import { Mic, Brain, FileText } from "lucide-react";

const steps = [
  {
    icon: Mic,
    title: "Record Your Idea",
    description:
      "Simply speak about your startup idea naturally. Our advanced audio processing captures every detail.",
    color: "text-primary",
  },
  {
    icon: Brain,
    title: "AI Analysis",
    description:
      "Our AI transcribes and analyzes your pitch using Guy Kawasaki's proven framework for maximum impact.",
    color: "text-accent",
  },
  {
    icon: FileText,
    title: "Get Results",
    description:
      "Receive an optimized one-liner and complete pitch deck structure ready for investors.",
    color: "text-primary-glow",
  },
];

const HowItWorksSection = () => {
  return (
    <section className="py-24 bg-background relative">
      <div className="absolute inset-0 pointer-events-none [mask-image:radial-gradient(circle_at_50%_40%,black,transparent_75%)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,hsl(226_85%_64%/.18),transparent_60%)]" />
      </div>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">How It Works</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transform your raw idea into a compelling pitch in just three simple
            steps
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              <div className="bg-gradient-card rounded-2xl p-8 shadow-card hover:shadow-elegant transition-smooth group-hover:scale-[1.03] ring-1 ring-border/60 backdrop-blur-sm relative overflow-hidden before:absolute before:inset-0 before:bg-[linear-gradient(140deg,hsl(226_85%_64%/.12),transparent_60%)] before:opacity-0 group-hover:before:opacity-100 before:transition-opacity">
                <div
                  className={`w-16 h-16 rounded-xl bg-gradient-primary flex items-center justify-center mb-6 group-hover:shadow-glow transition-smooth`}
                >
                  <step.icon className="w-8 h-8 text-primary-foreground" />
                </div>

                <h3 className="text-xl font-semibold mb-4">{step.title}</h3>

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
