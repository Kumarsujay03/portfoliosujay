import { useEffect, useRef, useState } from "react";

type SmartImageProps = {
  src: string;
  alt: string;
  webpSrc?: string | null;
  className?: string;
  imgClassName?: string;
  loading?: "lazy" | "eager";
  onError?: () => void;
};

const SmartImage = ({
  src,
  alt,
  webpSrc,
  className,
  imgClassName,
  loading = "lazy",
  onError,
}: SmartImageProps) => {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setLoaded(false);
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth > 0) {
      setLoaded(true);
    }
  }, [src, webpSrc]);

  return (
    <span className={`relative overflow-hidden ${className ?? ""}`}>
      {!loaded && <span aria-hidden className="img-skeleton absolute inset-0 z-0" />}
      {webpSrc ? (
        <picture className="contents">
          <source srcSet={webpSrc} type="image/webp" />
          <img
            ref={imgRef}
            src={src}
            alt={alt}
            loading={loading}
            decoding="async"
            onLoad={() => setLoaded(true)}
            onError={onError}
            className={`relative z-10 transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"} ${imgClassName ?? ""}`}
          />
        </picture>
      ) : (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          loading={loading}
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={onError}
          className={`relative z-10 transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"} ${imgClassName ?? ""}`}
        />
      )}
    </span>
  );
};

export default SmartImage;
