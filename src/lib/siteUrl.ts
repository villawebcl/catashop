const DEFAULT_SITE_URL = "https://catashop.cl";

export const getSiteUrl = () => {
  const value = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!value) return DEFAULT_SITE_URL;

  try {
    const url = new URL(value);
    return url.origin;
  } catch {
    return DEFAULT_SITE_URL;
  }
};
