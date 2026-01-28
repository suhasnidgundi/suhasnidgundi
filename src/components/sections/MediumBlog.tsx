import { BookOpen, ArrowRight, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MediumBlog = () => {
  // Mock blog posts - in production, fetch from Medium RSS
  const posts = [
    {
      id: 1,
      title: 'Building Scalable Microservices with Node.js and Docker',
      excerpt: 'A comprehensive guide to designing and deploying microservices architecture that can handle millions of requests.',
      date: 'Jan 15, 2025',
      readTime: '8 min read',
      url: '#',
    },
    {
      id: 2,
      title: 'My Journey from Intern to Full-Stack Developer',
      excerpt: 'Lessons learned, challenges faced, and skills acquired during my engineering journey.',
      date: 'Dec 28, 2024',
      readTime: '5 min read',
      url: '#',
    },
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl md:text-4xl font-bold text-foreground">
            Latest Articles
          </h2>
          <p className="text-lg text-muted-foreground">
            Thoughts on engineering, technology, and growth
          </p>
        </div>

        <div className="mx-auto max-w-4xl">
          <div className="grid gap-6 md:grid-cols-2">
            {posts.map((post) => (
              <article
                key={post.id}
                className="group rounded-xl border border-border bg-card p-6 card-hover"
              >
                <div className="mb-4 flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {post.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-3 w-3" />
                    {post.readTime}
                  </div>
                </div>

                <h3 className="mb-3 text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                  {post.title}
                </h3>

                <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
                  {post.excerpt}
                </p>

                <a
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm font-medium text-primary hover:underline"
                >
                  Read on Medium
                  <ArrowRight className="ml-1 h-4 w-4" />
                </a>
              </article>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Button variant="outline" asChild>
              <a
                href="https://medium.com/@suhasnidgundi"
                target="_blank"
                rel="noopener noreferrer"
              >
                View All Articles
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MediumBlog;
