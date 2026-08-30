import { useState } from "react";

type DitherPortraitProps = {
  src?: string;
  alt?: string;
  initials?: string;
  label?: string;
  className?: string;
};

const DitherPortrait = ({
  src = "/sujay.png",
  alt = "Sujay Kumar",
  initials = "SK",
  label = "/ researcher",
  className,
}: DitherPortraitProps) => {
  const [failed, setFailed] = useState(false);

  return (
    <figure className={className}>
      {!failed ? (
        <img
          src={src}
          alt={alt}
          onError={() => setFailed(true)}
          loading="eager"
          decoding="async"
          className="block h-auto w-full object-contain"
        />
      ) : (
        <div className="flex aspect-square w-full items-center justify-center rounded-2xl bg-muted/20">
          <span className="text-5xl font-semibold tracking-tight text-muted-foreground/50">
            {initials}
          </span>
        </div>
      )}

      {label && <figcaption className="mono-label mt-3 block">{label}</figcaption>}
    </figure>
  );
};

export default DitherPortrait;
