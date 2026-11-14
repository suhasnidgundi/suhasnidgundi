import { Briefcase, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useCurrentExperience } from '@/hooks/useExperiences';

const LatestExperience = () => {
  const { data: experience, isLoading } = useCurrentExperience();

  if (isLoading) {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          Loading latest experience...
        </div>
      </section>
    );
  }

  if (!experience) {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
            <Briefcase className="h-6 w-6 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-1">No Experience Records</h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            No work experience has been published to Vercel storage yet.
          </p>
        </div>
      </section>
    );
  }

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
                {experience.start_date && (
                  <p className="mb-4 text-sm text-muted-foreground">
                    {experience.start_date} {experience.end_date ? `- ${experience.end_date}` : '- Present'}
                  </p>
                )}
                {experience.description && (
                  <p className="text-muted-foreground">
                    {experience.description}
                  </p>
                )}
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
