import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Award, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";

const certifications = [
  {
    id: 1,
    name: "AWS Certified Solutions Architect",
    issuer: "Amazon Web Services",
    date: "2024",
    credentialId: "AWS-SAA-12345",
    link: "https://aws.amazon.com/verification",
    icon: "🏆",
  },
  {
    id: 2,
    name: "Professional Scrum Master I",
    issuer: "Scrum.org",
    date: "2023",
    credentialId: "PSM-67890",
    link: "https://scrum.org/certificates",
    icon: "📜",
  },
  {
    id: 3,
    name: "Meta Front-End Developer",
    issuer: "Meta (Coursera)",
    date: "2023",
    credentialId: "META-FE-11111",
    link: "https://coursera.org/verify",
    icon: "🎓",
  },
  {
    id: 4,
    name: "Google Cloud Professional",
    issuer: "Google Cloud",
    date: "2023",
    credentialId: "GCP-22222",
    link: "https://cloud.google.com/certification",
    icon: "☁️",
  },
  {
    id: 5,
    name: "MongoDB Certified Developer",
    issuer: "MongoDB University",
    date: "2022",
    credentialId: "MDB-33333",
    link: "https://university.mongodb.com",
    icon: "🍃",
  },
  {
    id: 6,
    name: "Certified Kubernetes Administrator",
    issuer: "CNCF",
    date: "2022",
    credentialId: "CKA-44444",
    link: "https://cncf.io/certification",
    icon: "⚙️",
  },
];

const Certifications = () => {
  const [showAll, setShowAll] = useState(false);
  const [visibleCount, setVisibleCount] = useState(3);

  useEffect(() => {
    const updateVisibleCount = () => {
      if (window.innerWidth >= 1024) {
        setVisibleCount(3); // lg: 3 columns
      } else if (window.innerWidth >= 768) {
        setVisibleCount(4); // md: 2 columns, show 4
      } else {
        setVisibleCount(3); // mobile: 1 column, show 3
      }
    };

    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);
    return () => window.removeEventListener("resize", updateVisibleCount);
  }, []);

  const displayedCerts = showAll ? certifications : certifications.slice(0, visibleCount);
  const hiddenCount = certifications.length - visibleCount;

  return (
    <section id="certifications" className="py-20 bg-muted/30">
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
            <span className="ml-2 font-mono text-xs text-muted-foreground">certifications.json</span>
          </div>
          <div className="bg-card border-x border-b border-border rounded-b-lg p-6">
            <h2 className="text-3xl font-bold font-mono mb-2 flex items-center gap-3">
              <Award className="w-8 h-8 text-primary" />
              <span className="text-gradient">Certifications</span>
            </h2>
            <p className="text-muted-foreground font-mono text-sm">
              <span className="syntax-comment">{"// "}</span>
              Professional credentials and achievements
            </p>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {displayedCerts.map((cert, index) => (
              <motion.div
                key={cert.id}
                layout
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="terminal-window group hover:border-primary/50 transition-colors"
              >
                <div className="terminal-header">
                  <div className="terminal-dot bg-destructive"></div>
                  <div className="terminal-dot bg-accent"></div>
                  <div className="terminal-dot bg-code-green"></div>
                  <span className="ml-2 font-mono text-xs text-muted-foreground">
                    {cert.date}
                  </span>
                </div>
                
                <div className="p-5">
                  <div className="flex items-start gap-3 mb-3">
                    <motion.span 
                      className="text-2xl"
                      whileHover={{ scale: 1.2, rotate: 10 }}
                    >
                      {cert.icon}
                    </motion.span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-mono text-sm font-semibold text-foreground group-hover:text-primary transition-colors leading-tight">
                        {cert.name}
                      </h3>
                      <p className="font-mono text-xs text-muted-foreground mt-1">
                        @ {cert.issuer}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-xs font-mono">
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span className="syntax-keyword">credentialId:</span>
                      <span className="syntax-string">"{cert.credentialId}"</span>
                    </div>
                    
                    {cert.link && (
                      <motion.a
                        href={cert.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ x: 4 }}
                        className="flex items-center gap-1 text-code-blue hover:text-primary transition-colors mt-3"
                      >
                        <span>verify()</span>
                        <ExternalLink className="w-3 h-3" />
                      </motion.a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Show All / Show Less Button */}
        {certifications.length > visibleCount && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-8 text-center"
          >
            <motion.button
              onClick={() => setShowAll(!showAll)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="font-mono text-sm px-6 py-3 border border-border rounded-lg bg-card hover:border-primary hover:text-primary transition-all inline-flex items-center gap-2 group"
            >
              {showAll ? (
                <>
                  <span>showLess()</span>
                  <ChevronUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                </>
              ) : (
                <>
                  <span>showAll({hiddenCount})</span>
                  <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                </>
              )}
            </motion.button>
          </motion.div>
        )}
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-6 text-center"
        >
          <p className="font-mono text-xs text-muted-foreground">
            <span className="syntax-comment">{"// "}</span>
            Total: {certifications.length} certifications
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Certifications;
