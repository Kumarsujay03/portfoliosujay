import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

type SeoProps = {
  title?: string;
  description?: string;
  imagePath?: string;
  noIndex?: boolean;
};

const getSiteUrl = () => {
  const fromEnv = import.meta.env.VITE_SITE_URL as string | undefined;
  if (fromEnv && fromEnv.trim().length > 0) return fromEnv.replace(/\/$/, "");
  return null;
};

const Seo = ({
  title,
  description = "Sujay Kumar - software engineer portfolio. Projects, experience, certifications, and contact.",
  imagePath = "/og-image.png",
  noIndex = false,
}: SeoProps) => {
  const { pathname } = useLocation();
  const siteUrl = getSiteUrl();
  const bingVerification = (import.meta.env.VITE_BING_SITE_VERIFICATION as string | undefined)?.trim();

  const baseTitle = "Sujay Kumar";
  const defaultTitle = `${baseTitle} - Portfolio`;
  const fullTitle = pathname === "/" ? defaultTitle : title ? `${title} | ${baseTitle}` : defaultTitle;

  const normalizedPath = pathname === "/" ? "" : pathname;
  const canonicalUrl = siteUrl ? `${siteUrl}${normalizedPath}` : null;
  const ogUrl = canonicalUrl;
  const ogImage = siteUrl ? `${siteUrl}${imagePath}` : imagePath;
  const ogImageType = imagePath.endsWith(".png") ? "image/png" : imagePath.endsWith(".jpg") || imagePath.endsWith(".jpeg") ? "image/jpeg" : undefined;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />

      {noIndex ? (
        <meta name="robots" content="noindex,nofollow" />
      ) : (
        <meta name="robots" content="index,follow" />
      )}

      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      {bingVerification && <meta name="msvalidate.01" content={bingVerification} />}

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content={baseTitle} />
      <meta property="og:locale" content="en_US" />
      {ogUrl && <meta property="og:url" content={ogUrl} />}
      <meta property="og:type" content="website" />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:secure_url" content={ogImage} />
      {ogImageType && <meta property="og:image:type" content={ogImageType} />}
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={`${baseTitle} portfolio preview`} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={`${baseTitle} portfolio preview`} />
      {ogUrl && <meta name="twitter:url" content={ogUrl} />}
    </Helmet>
  );
};

export default Seo;
