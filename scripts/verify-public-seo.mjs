const siteUrl = new URL(process.env.SITE_URL ?? "https://pixelutils.app");

if (siteUrl.protocol !== "https:") {
  throw new Error("SITE_URL must use HTTPS for public SEO verification.");
}

const origin = siteUrl.origin;
const allowedAiSearchCrawlers = [
  "Googlebot",
  "Bingbot",
  "OAI-SearchBot",
  "Google-Extended",
  "ClaudeBot",
  "PerplexityBot",
];
const samplePaths = [
  "/",
  "/tools/merge-pdf",
  "/guides/remove-image-metadata-before-sharing",
];

function getCrawlerBlock(robotsText, crawler) {
  const groups = robotsText.split(/(?=^User-Agent:\s*)/gim);
  return groups.find((group) =>
    new RegExp(`^User-Agent:\\s*${crawler}\\s*$`, "im").test(group),
  );
}

function blocksRootPath(robotsText, crawler) {
  const block = getCrawlerBlock(robotsText, crawler);
  return block ? /^Disallow:\s*\/\s*$/im.test(block) : false;
}

async function fetchRequired(path, expectedContentType) {
  const response = await fetch(new URL(path, origin));
  if (!response.ok) {
    throw new Error(`${path} returned HTTP ${response.status}.`);
  }
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes(expectedContentType)) {
    throw new Error(`${path} returned unexpected content type "${contentType}".`);
  }
  return response.text();
}

const robotsText = await fetchRequired("/robots.txt", "text/plain");
if (/BEGIN Cloudflare Managed Content/i.test(robotsText)) {
  throw new Error(
    "Cloudflare Managed robots.txt content is still prepended. Disable it before relying on the origin crawler policy.",
  );
}
for (const crawler of allowedAiSearchCrawlers) {
  if (blocksRootPath(robotsText, crawler)) {
    throw new Error(`${crawler} is blocked from the public site in robots.txt.`);
  }
}
if (!blocksRootPath(robotsText, "GPTBot")) {
  throw new Error("GPTBot must be explicitly blocked from the public site.");
}

const sitemapText = await fetchRequired("/sitemap.xml", "xml");
const sitemapUrls = [...sitemapText.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
  ([, value]) => value,
);
if (sitemapUrls.length === 0) {
  throw new Error("The sitemap has no URLs.");
}
for (const url of sitemapUrls) {
  const parsedUrl = new URL(url);
  if (parsedUrl.origin !== origin || parsedUrl.search || parsedUrl.hash) {
    throw new Error(`The sitemap contains an invalid public URL: ${url}`);
  }
}
for (const path of samplePaths) {
  const html = await fetchRequired(path, "text/html");
  const canonical = new URL(path, origin).toString();
  if (!html.includes(`rel="canonical" href="${canonical}"`)) {
    throw new Error(`${path} is missing the expected canonical URL.`);
  }
  if (!/<h1[\s>]/i.test(html)) {
    throw new Error(`${path} is missing a visible H1.`);
  }
}

console.log(
  `Public SEO verification passed for ${origin}: ${sitemapUrls.length} sitemap URLs and ${samplePaths.length} representative pages checked.`,
);
