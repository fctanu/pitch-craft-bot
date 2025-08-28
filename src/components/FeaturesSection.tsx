import { CheckCircle, Zap, Target, Users, BarChart3, Clock } from "lucide-react";

const features = [
  {
    icon: Target,
    title: "Guy Kawasaki's Formula",
    description: "Based on the legendary 10/20/30 rule and proven pitch structure that has helped countless startups raise funding."
  },
  {
    icon: Zap,
    title: "Instant Optimization",
    description: "Get your optimized one-liner and pitch structure in under 2 minutes. No more weeks of iteration."
  },
  {
    icon: BarChart3,
    title: "Pitch Library",
    description: "Access all your optimized pitches in one place. Edit, refine, and track your pitch evolution over time."
  },
  {
    icon: Users,
    title: "Investor-Ready",
    description: "Structured specifically for what investors want to hear. Increase your chances of getting that crucial meeting."
  },
  {
    icon: Clock,
    title: "Time-Saving",
    description: "Skip hours of research and writing. Focus on what matters most - building your product and talking to customers."
  },
  {
    icon: CheckCircle,
    title: "Proven Framework",
    description: "Every element follows time-tested principles that have helped startups raise over $10B in funding."
  }
];

const FeaturesSection = () => {
  return (
    <section className="py-24 bg-gradient-hero">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Why Founders Choose Us
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Built specifically for startup founders who need to pitch effectively and raise funding faster
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="group">
              <div className="bg-card rounded-2xl p-6 shadow-card hover:shadow-elegant transition-smooth group-hover:scale-105 h-full">
                <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center mb-4 group-hover:shadow-glow transition-smooth">
                  <feature.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                
                <h3 className="text-lg font-semibold mb-3 text-card-foreground">
                  {feature.title}
                </h3>
                
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;