import { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/siteUrl";

export default function robots(): MetadataRoute.Robots {
    const siteUrl = getSiteUrl();
    return {
        host: siteUrl,
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: ["/admin", "/carrito"],
        },
        sitemap: `${siteUrl}/sitemap.xml`,
    };
}
