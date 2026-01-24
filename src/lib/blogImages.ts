const blogImages = import.meta.glob("../assets/blog_img/*", {
  eager: true,
  import: "default",
}) as Record<string, string>;

const normalize = (fileName?: string) => {
  const name = (fileName ?? "").trim();
  return name.length > 0 ? name : null;
};

export const getBlogImgSrc = (fileName?: string) => {
  const name = normalize(fileName);
  if (!name) return null;

  return blogImages[`../assets/blog_img/${name}`] ?? null;
};

export const getBlogWebpSrc = (fileName?: string) => {
  const name = normalize(fileName);
  if (!name) return null;

  const webpName = name.replace(/\.(png|jpe?g)$/i, ".webp");
  if (webpName === name) return null;

  return blogImages[`../assets/blog_img/${webpName}`] ?? null;
};
