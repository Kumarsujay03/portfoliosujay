import { motion } from "framer-motion";

const blogPosts = [
  {
    id: 1,
    title: "Building Scalable APIs with Node.js",
    date: "2024-01-15",
    readTime: "8 min",
    tags: ["nodejs", "api", "backend"],
    preview: `// Implementing rate limiting middleware
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests
  message: { error: 'Too many requests' }
});

app.use('/api/', limiter);`,
    summary: "Learn how to build production-ready APIs with proper rate limiting, caching, and error handling patterns."
  },
  {
    id: 2,
    title: "TypeScript Generics Deep Dive",
    date: "2024-01-08",
    readTime: "12 min",
    tags: ["typescript", "generics", "types"],
    preview: `// Generic utility type for API responses
type ApiResponse<T> = {
  data: T;
  status: 'success' | 'error';
  timestamp: Date;
};

// Usage with type inference
const fetchUser = async (): Promise<ApiResponse<User>> => {
  // implementation
};`,
    summary: "Master TypeScript generics with practical examples including utility types and conditional types."
  },
  {
    id: 3,
    title: "React Performance Optimization",
    date: "2023-12-22",
    readTime: "10 min",
    tags: ["react", "performance", "optimization"],
    preview: `// Using useMemo for expensive calculations
const memoizedValue = useMemo(() => {
  return heavyComputation(data);
}, [data]);

// React.memo for component memoization
const ListItem = React.memo(({ item }) => (
  <div className="list-item">{item.name}</div>
));`,
    summary: "Practical techniques for optimizing React applications including memoization, code splitting, and lazy loading."
  },
];

const Blog = () => {
  return (
    <section id="blog" className="py-20 bg-muted/30">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="terminal-header mb-0 rounded-t-lg">
            <div className="terminal-dot bg-destructive"></div>
            <div className="terminal-dot bg-accent"></div>
            <div className="terminal-dot bg-code-green"></div>
            <span className="ml-2 font-mono text-xs text-muted-foreground">blog.md</span>
          </div>
          <div className="bg-card border-x border-b border-border rounded-b-lg p-6">
            <h2 className="text-3xl font-bold font-mono mb-2">
              <span className="text-muted-foreground"># </span>
              <span className="text-gradient">Technical Blog</span>
            </h2>
            <p className="text-muted-foreground font-mono text-sm">
              <span className="syntax-comment">{"// "}</span>
              Thoughts on code, architecture, and development
            </p>
          </div>
        </motion.div>

        <div className="grid gap-8">
          {blogPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="terminal-window group cursor-pointer hover:border-primary/50 transition-colors"
            >
              <div className="terminal-header">
                <div className="terminal-dot bg-destructive"></div>
                <div className="terminal-dot bg-accent"></div>
                <div className="terminal-dot bg-code-green"></div>
                <span className="ml-2 font-mono text-xs text-muted-foreground flex-1">
                  {post.title.toLowerCase().replace(/\s+/g, '-')}.tsx
                </span>
                <span className="font-mono text-xs text-muted-foreground">
                  {post.date}
                </span>
              </div>
              
              <div className="p-6">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <h3 className="font-mono text-xl text-foreground group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <span className="font-mono text-xs text-muted-foreground">
                    ~ {post.readTime} read
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-mono text-xs px-2 py-1 rounded bg-muted text-code-blue"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                
                <p className="text-muted-foreground text-sm mb-4">
                  {post.summary}
                </p>
                
                <div className="code-block overflow-x-auto">
                  <pre className="text-xs leading-relaxed">
                    <code>
                      {post.preview.split('\n').map((line, i) => (
                        <div key={i} className="flex">
                          <span className="text-muted-foreground/50 select-none w-8 text-right pr-4">
                            {i + 1}
                          </span>
                          <span className={
                            line.trim().startsWith('//')
                              ? 'syntax-comment'
                              : line.includes('const') || line.includes('type') || line.includes('async')
                              ? ''
                              : ''
                          }>
                            {line.split(' ').map((word, j) => {
                              if (['const', 'type', 'async', 'await', 'return', 'require'].includes(word)) {
                                return <span key={j} className="syntax-keyword">{word} </span>;
                              }
                              if (word.includes("'") || word.includes('"') || word.includes('`')) {
                                return <span key={j} className="syntax-string">{word} </span>;
                              }
                              if (!isNaN(Number(word)) && word !== '') {
                                return <span key={j} className="syntax-number">{word} </span>;
                              }
                              return <span key={j}>{word} </span>;
                            })}
                          </span>
                        </div>
                      ))}
                    </code>
                  </pre>
                </div>
                
                <div className="mt-4 flex items-center gap-2 font-mono text-sm text-primary group-hover:translate-x-2 transition-transform">
                  <span>readMore()</span>
                  <span>→</span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blog;
