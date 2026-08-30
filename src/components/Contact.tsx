import { motion } from "framer-motion";
import { Mail, Github, Linkedin, ArrowUpRight } from "lucide-react";
import RevealOnView from "@/components/RevealOnView";
import SectionHeader from "@/components/SectionHeader";

type ContactProps = {
  hideLabel?: boolean;
  animateOnView?: boolean;
};

const EMAIL = "mr.sujaykumar03@gmail.com";

const socials = [
  { icon: Github, href: "https://github.com/Kumarsujay03", label: "GitHub" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/kumarsujay03/", label: "LinkedIn" },
  { icon: Mail, href: `mailto:${EMAIL}`, label: "Email" },
];

const Contact = ({ animateOnView = false }: ContactProps) => {
  const content = (
    <div>
      <SectionHeader index="06" title="contact" className="mb-8" />

      <h2 className="max-w-2xl text-2xl md:text-3xl font-medium tracking-tight text-foreground">
        Let's talk research, models, or a hard problem.
      </h2>
      <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
        I'm open to research collaborations, applied-ML roles, and interesting
        conversations. The fastest way to reach me is email.
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <a
          href={`mailto:${EMAIL}`}
          className="hover-lift-sm group inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 font-mono text-sm text-primary-foreground hover:opacity-90"
        >
          <Mail className="h-4 w-4" />
          {EMAIL}
        </a>
      </div>

      <div className="mt-10 flex items-center gap-4">
        {socials.map((social) => (
          <a
            key={social.label}
            href={social.href}
            target={social.href.startsWith("mailto:") ? undefined : "_blank"}
            rel={social.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
            aria-label={social.label}
            className="inline-flex items-center gap-1.5 font-mono text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <social.icon className="h-4 w-4" />
            {social.label}
            <ArrowUpRight className="h-3.5 w-3.5 opacity-50" />
          </a>
        ))}
      </div>
    </div>
  );

  return (
    <section id="contact" className="py-16 md:py-24 relative scroll-offset">
      <div className="container-page">
        {animateOnView ? (
          <RevealOnView>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              {content}
            </motion.div>
          </RevealOnView>
        ) : (
          content
        )}
      </div>
    </section>
  );
};

export default Contact;
