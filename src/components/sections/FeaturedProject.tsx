import { ExternalLink, Github, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const FeaturedProject = () => {
  const project = {
    title: 'Cloud Deployment Pipeline',
    description: 'An automated CI/CD pipeline that streamlines deployment workflows, reducing deployment time by 75% while ensuring code quality through integrated testing.',
    image: '/placeholder.svg',
    techStack: ['Next.js', 'AWS', 'Docker', 'GitHub Actions', 'Terraform'],
    impact: 'Reduced deployment cycle from 2 hours to 30 minutes',
    githubUrl: '#',
    liveUrl: '#',
  };

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl md:text-4xl font-bold text-foreground">
            Featured Project
          </h2>
          <p className="text-lg text-muted-foreground">
            My proudest work with real-world impact
          </p>
        </div>

        <div className="mx-auto max-w-5xl">
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-lg card-hover">
            <div className="grid md:grid-cols-2 gap-0">
              {/* Project Image */}
              <div className="relative aspect-video md:aspect-auto bg-muted">
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                  <div className="text-center p-8">
                    <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                      <TrendingUp className="h-8 w-8 text-primary" />
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">Project Preview</p>
                  </div>
                </div>
              </div>

              {/* Project Details */}
              <div className="flex flex-col justify-center p-6 md:p-8">
                <h3 className="mb-3 text-2xl font-bold text-foreground">
                  {project.title}
                </h3>
                <p className="mb-4 text-muted-foreground">
                  {project.description}
                </p>

                {/* Tech Stack */}
                <div className="mb-4 flex flex-wrap gap-2">
                  {project.techStack.map((tech) => (
                    <Badge key={tech} variant="secondary" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>

                {/* Impact Metric */}
                <div className="mb-6 rounded-lg bg-primary/5 p-4 border border-primary/10">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <span className="font-medium text-foreground">Impact:</span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {project.impact}
                  </p>
                </div>

                {/* CTAs */}
                <div className="flex gap-3">
                  <Button className="flex-1" asChild>
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View Details
                    </a>
                  </Button>
                  <Button variant="outline" size="icon" asChild>
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" aria-label="View on GitHub">
                      <Github className="h-5 w-5" />
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProject;
