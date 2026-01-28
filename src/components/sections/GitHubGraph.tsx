import { ExternalLink } from 'lucide-react';

const GitHubGraph = () => {
  // Generate mock contribution data
  const weeks = 52;
  const daysPerWeek = 7;
  const contributions = Array.from({ length: weeks }, () =>
    Array.from({ length: daysPerWeek }, () => Math.floor(Math.random() * 5))
  );

  const getContributionColor = (level: number) => {
    const colors = [
      'bg-muted',
      'bg-primary/20',
      'bg-primary/40',
      'bg-primary/60',
      'bg-primary',
    ];
    return colors[level];
  };

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl md:text-4xl font-bold text-foreground">
            Coding Consistency
          </h2>
          <p className="text-lg text-muted-foreground">
            My GitHub contribution activity
          </p>
        </div>

        <div className="mx-auto max-w-5xl">
          <div className="overflow-hidden rounded-xl border border-border bg-card p-6">
            {/* Contribution Graph */}
            <div className="overflow-x-auto pb-4">
              <div className="flex gap-[3px] min-w-max">
                {contributions.map((week, weekIndex) => (
                  <div key={weekIndex} className="flex flex-col gap-[3px]">
                    {week.map((level, dayIndex) => (
                      <div
                        key={`${weekIndex}-${dayIndex}`}
                        className={`h-3 w-3 rounded-sm ${getContributionColor(level)} transition-colors`}
                        title={`${level} contributions`}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>Less</span>
                {[0, 1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    className={`h-3 w-3 rounded-sm ${getContributionColor(level)}`}
                  />
                ))}
                <span>More</span>
              </div>

              <a
                href="https://github.com/suhasnidgundi"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-primary hover:underline"
              >
                View on GitHub
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GitHubGraph;
