import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

type SeoProps = {
  title?: string;
  description?: string;
  imagePath?: string;
  noIndex?: boolean;
  type?: "website" | "article";
  jsonLd?: Record<string, unknown>;
};

const getSiteUrl = () => {
  const fromEnv = import.meta.env.VITE_SITE_URL as string | undefined;
  if (fromEnv && fromEnv.trim().length > 0) return fromEnv.replace(/\/$/, "");
  return null;
};

const IMAGE_MIME: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  gif: "image/gif",
  avif: "image/avif",
};

const getImageMimeType = (url: string): string | undefined => {
  const match = /\.([a-z0-9]+)(?:[?#]|$)/i.exec(url);
  return match ? IMAGE_MIME[match[1].toLowerCase()] : undefined;
};

const Seo = ({
  title,
  description = "Sujay Kumar - machine learning researcher and engineer. Research interests, selected work, writing, and contact.",
  imagePath = "/og-image.png",
  noIndex = false,
  type = "website",
  jsonLd,
}: SeoProps) => {
  const { pathname } = useLocation();
  const siteUrl = getSiteUrl();

  // Descriptions must be single-line (Warehouse summaries may contain newlines).
  const metaDescription = description.replace(/\s+/g, " ").trim();

  const baseTitle = "Sujay Kumar";
  const defaultTitle = `${baseTitle} - Machine Learning Researcher`;
  const fullTitle = pathname === "/" ? defaultTitle : title ? `${title} | ${baseTitle}` : defaultTitle;

  const normalizedPath = pathname === "/" ? "" : pathname;
  const canonicalUrl = siteUrl ? `${siteUrl}${normalizedPath}` : null;
  const ogUrl = canonicalUrl;
  const imageIsAbsolute = /^https?:\/\//i.test(imagePath);
  const ogImage = imageIsAbsolute ? imagePath : siteUrl ? `${siteUrl}${imagePath}` : imagePath;
  const ogImageType = getImageMimeType(imagePath);

  // Only declare pixel dimensions for our own generated card, which really is
  // 1200x630. Post images come from Warehouse at arbitrary sizes, and claiming
  // the wrong dimensions makes some crawlers skip the large preview card.
  const imageIsDefault = /(^|\/)og-image\.png$/i.test(imagePath);

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />

      {noIndex ? (
        <meta name="robots" content="noindex,nofollow" />
      ) : (
        <meta name="robots" content="index,follow" />
      )}

      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:site_name" content={baseTitle} />
      <meta property="og:locale" content="en_US" />
      {ogUrl && <meta property="og:url" content={ogUrl} />}
      <meta property="og:type" content={type} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:secure_url" content={ogImage} />
      {ogImageType && <meta property="og:image:type" content={ogImageType} />}
      {imageIsDefault && <meta property="og:image:width" content="1200" />}
      {imageIsDefault && <meta property="og:image:height" content="630" />}
      <meta property="og:image:alt" content={`${baseTitle} portfolio preview`} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={`${baseTitle} portfolio preview`} />
      {ogUrl && <meta name="twitter:url" content={ogUrl} />}

      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  );
};

export default Seo;
