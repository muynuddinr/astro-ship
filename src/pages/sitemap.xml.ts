import type { APIRoute } from 'astro';

// Group pages by type for better organization
const pages = {
  main: [
    "",
    "about",
    "contact"
  ],
  services: [
    "services",
    "services/cabin-stores",
    "services/deck-stores",
    "services/engine-stores",
    "services/marine-equipments",
    "services/provision-stores"
  ]
};

export const GET: APIRoute = async () => {
  const siteUrl = import.meta.env.DEV ? "http://localhost:4321" : "https://alcanzaship.com";
  const currentDate = new Date().toISOString();

  const generateUrl = (page: string, priority: string, changefreq: string) => `
    <url>
      <loc>${siteUrl}/${page}</loc>
      <lastmod>${currentDate}</lastmod>
      <changefreq>${changefreq}</changefreq>
      <priority>${priority}</priority>
    </url>`;

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
            xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
            xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
            http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
      ${pages.main.map(page => 
        generateUrl(page, page === "" ? "1.0" : "0.9", "weekly")
      ).join("")}
      ${pages.services.map(page => 
        generateUrl(page, "0.8", "monthly")
      ).join("")}
    </urlset>`;

  return new Response(sitemap.trim(), {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600'
    },
  });
} 