import { ArrowRight, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex items-center py-20">
      {/* Background gradient */}
      <div 
        className="absolute inset-0 -z-10" 
        style={{ background: 'var(--gradient-hero)' }}
      />
      
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Profile Photo */}
          <div className="flex-shrink-0">
            <div className="relative">
              <div className="absolute -inset-1 rounded-full bg-primary/20 blur-xl" />
              <div className="relative h-48 w-48 md:h-64 md:w-64 overflow-hidden rounded-full border-4 border-primary/20 bg-muted">
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                  <span className="text-6xl md:text-7xl font-bold text-primary">SN</span>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 text-center lg:text-left">
            <h1 className="mb-4 text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
              Suhas Nidgundi
            </h1>
            <p className="mb-6 text-xl md:text-2xl font-medium text-primary">
              Engineering scalable systems with clarity and impact
            </p>
            <p className="mb-8 max-w-2xl text-lg text-muted-foreground">
              Final-year engineer building scalable systems and empowering communities through code. 
              Passionate about cloud architecture, open source, and creating meaningful software.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link to="/projects">
                <Button size="lg" className="group">
                  View Projects
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Button variant="outline" size="lg">
                <Download className="mr-2 h-4 w-4" />
                Download Resume
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
