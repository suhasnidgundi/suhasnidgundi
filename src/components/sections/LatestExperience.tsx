import { Briefcase, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const LatestExperience = () => {
  const experience = {
    role: 'Software Engineering Intern',
    company: 'Tech Solutions Inc.',
    duration: 'June 2024 - Present',
    impact: 'Implemented microservices architecture reducing API latency by 40% and improving system reliability.',
  };

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl md:text-4xl font-bold text-foreground">
            Latest Experience
          </h2>
          <p className="text-lg text-muted-foreground">
            Where I'm currently making an impact
          </p>
        </div>

        <div className="mx-auto max-w-3xl">
          <div className="rounded-xl border border-border bg-card p-6 md:p-8 card-hover">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Briefcase className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="mb-1 text-xl font-bold text-foreground">
                  {experience.role}
                </h3>
                <p className="mb-2 font-medium text-primary">
                  {experience.company}
                </p>
                <p className="mb-4 text-sm text-muted-foreground">
                  {experience.duration}
                </p>
                <p className="text-muted-foreground">
                  {experience.impact}
                </p>
              </div>
            </div>

            <div className="mt-6 border-t border-border pt-6">
              <Link to="/experience">
                <Button variant="ghost" className="group">
                  View Full Experience
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LatestExperience;
