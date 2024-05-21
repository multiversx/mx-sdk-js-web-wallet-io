export const extractDomain = (url = "") => {
  let domain: string | null = null;

  try {
    const { hostname } = new URL(url);
    const domainArray = hostname?.split(".");
    const lastPart = domainArray[domainArray.length - 1];
    const firstPart = domainArray[domainArray.length - 2];
    domain = `${firstPart}.${lastPart}`;
    const isDevelopment = lastPart === "localhost";

    return { domain, isDevelopment };
  } catch {
    return { domain, isDevelopment: false };
  }
};
