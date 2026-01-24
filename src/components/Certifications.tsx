import { motion } from "framer-motion";
import { Award, ExternalLink } from "lucide-react";

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
          {certifications.map((cert, index) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
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
                  <span className="text-2xl">{cert.icon}</span>
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
                    <a
                      href={cert.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-code-blue hover:text-primary transition-colors mt-3"
                    >
                      <span>verify()</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-8 text-center"
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
