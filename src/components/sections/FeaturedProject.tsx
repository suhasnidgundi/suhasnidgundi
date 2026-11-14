import { TrendingUp, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { useFeaturedProject } from '@/hooks/useProjects';

const FeaturedProject = () => {
  const { data: project, isLoading } = useFeaturedProject();

  if (isLoading) {
    return (
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          Loading featured project...
        </div>
      </section>
    );
  }

  if (!project) {
    return (
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
            <FolderOpen className="h-6 w-6 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-1">No Featured Project</h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            No projects have been marked as featured in Vercel storage yet.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl md:text-4xl font-bold text-foreground">
            Featured Project
          </h2>
          <p className="text-lg text-muted-foreground">
            Real-world impact and production systems
          </p>
        </div>

        <div className="mx-auto max-w-5xl">
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-lg card-hover">
            <div className="grid md:grid-cols-2 gap-0">
              {/* Project Image / Icon */}
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
                {project.tech_stack && project.tech_stack.length > 0 && (
                  <div className="mb-4 flex flex-wrap gap-2">
                    {project.tech_stack.map((tech) => (
                      <Badge key={tech} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Impact Metric */}
                {project.impact_metric && (
                  <div className="mb-6 rounded-lg bg-primary/5 p-4 border border-primary/10">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      <span className="text-sm font-semibold text-primary">
                        {project.impact_metric}
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex gap-4">
                  <Link to={`/projects/${project.$id}`}>
                    <Button>View Details</Button>
                  </Link>
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
