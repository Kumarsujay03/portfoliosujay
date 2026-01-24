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
  description = "Sujay Kumar — software engineer portfolio.",
  imagePath = "/favicon.svg",
  noIndex = false,
}: SeoProps) => {
  const { pathname } = useLocation();
  const siteUrl = getSiteUrl();

  const baseTitle = "Sujay Kumar";
  const fullTitle = title ? `${title} | ${baseTitle}` : `${baseTitle} — Portfolio`;

  const canonicalUrl = siteUrl ? `${siteUrl}${pathname}` : null;
  const ogUrl = canonicalUrl;
  const ogImage = siteUrl ? `${siteUrl}${imagePath}` : imagePath;

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

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content={baseTitle} />
      {ogUrl && <meta property="og:url" content={ogUrl} />}
      <meta property="og:type" content="website" />
      <meta property="og:image" content={ogImage} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
};

export default Seo;
