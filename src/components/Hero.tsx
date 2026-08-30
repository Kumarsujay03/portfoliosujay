import { motion, type Variants } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Github, Linkedin, Mail, MapPin, FileText } from "lucide-react";
import DitherPortrait from "@/components/DitherPortrait";

const roles = [
  "Machine Learning Researcher",
  "Applied AI Engineer",
  "Deep Learning · NLP",
];

const socials = [
  { icon: Github, href: "https://github.com/Kumarsujay03", label: "GitHub" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/kumarsujay03/", label: "LinkedIn" },
  { icon: Mail, href: "mailto:mr.sujaykumar03@gmail.com", label: "Email" },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: 0.05 * i, ease: "easeOut" },
  }),
};

const Hero = () => {
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setRoleIndex((prev) => (prev + 1) % roles.length), 2800);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative pt-28 pb-10 md:pt-32">
      <div className="container-page">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_auto]">
          <div>
            <motion.div
              custom={0}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="flex flex-wrap items-center gap-3"
            >
              <span className="pill border-accent/30 text-foreground">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-accent opacity-70 animate-ping" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
                </span>
                open to research &amp; opportunities
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                Bengaluru, India
              </span>
            </motion.div>

            <motion.h1
              custom={1}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="mt-6 text-4xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-5xl md:text-6xl [word-spacing:-0.28em]"
            >
              Sujay Kumar
            </motion.h1>

            <motion.div
              custom={2}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="mt-4 h-6 overflow-hidden"
            >
              <motion.div
                animate={{ y: -roleIndex * 24 }}
                transition={{ type: "spring", stiffness: 260, damping: 30 }}
              >
                {roles.map((role) => (
                  <p key={role} className="flex h-6 items-center text-sm text-muted-foreground">
                    <span className="mr-2 text-muted-foreground/50">{">"}</span>
                    {role}
                  </p>
                ))}
              </motion.div>
            </motion.div>

            <motion.p
              custom={3}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="mt-6 max-w-xl text-[14px] leading-relaxed text-muted-foreground"
            >
              I build intelligent systems at the intersection of machine learning and
              engineering — deep learning, NLP, and turning research ideas into models
              and tools that hold up in production.
            </motion.p>

            <motion.div
              custom={4}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <Link
                to="/projects"
                className="hover-lift-sm group inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm text-primary-foreground hover:opacity-90"
              >
                view work
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <Link
                to="/blog"
                className="hover-lift-sm inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm text-foreground hover:border-foreground/40"
              >
                my writing
              </Link>
              <a
                href="/Resume_Sujay.pdf"
                download
                className="hover-lift-sm inline-flex items-center gap-2 rounded-full px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground"
              >
                <FileText className="h-4 w-4" />
                CV
              </a>
            </motion.div>

            <motion.div
              custom={5}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="mt-8 flex items-center gap-4"
            >
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target={social.href.startsWith("mailto:") ? undefined : "_blank"}
                  rel={social.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                  aria-label={social.label}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="order-first mx-auto w-56 sm:w-64 lg:order-last lg:w-[20rem] xl:w-[22rem]"
          >
            <DitherPortrait />
          </motion.div>
        </div>

        <div className="mt-14 h-px w-full bg-border" />
      </div>
    </section>
  );
};

export default Hero;
