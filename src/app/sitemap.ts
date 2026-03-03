import { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/siteUrl";
import { buildProductPath } from "@/lib/productSeo";
import { getPublicProducts } from "@/lib/products";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = getSiteUrl();
    const staticUrls: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 1,
        },
        {
            url: `${baseUrl}/productos`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 0.8,
        },
        {
            url: `${baseUrl}/ofertas`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 0.8,
        },
        {
            url: `${baseUrl}/faq`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.5,
        },
    ];

    const products = await getPublicProducts();
    const productUrls: MetadataRoute.Sitemap = products.map((product) => ({
        url: `${baseUrl}${buildProductPath(product)}`,
        lastModified: product.created_at ? new Date(product.created_at) : new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
    }));

    return [...staticUrls, ...productUrls];
}
