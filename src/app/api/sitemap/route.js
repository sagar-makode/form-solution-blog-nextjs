import { fetchBlogs } from '@/fetchblogs/fetchBlogs';
import { fetchCategories } from '@/fetchblogs/fetchCategories'; // Import your category fetching function
import { getServerSideSitemap } from 'next-sitemap';
import { NextResponse } from 'next/server';

export async function GET() {
  const fields = [
    {
      loc: `${process.env.SITEMAP_URL}/`,  // Homepage
      lastmod: new Date().toISOString(),
      changefreq: 'daily',
      priority: '1.0',
    },
  ];

  // Add dynamic blog URLs
  const allBlogs = await fetchBlogs();
  allBlogs.forEach((blog) => {
    fields.push({
      loc: `${process.env.SITEMAP_URL}/blog/${blog.slug}`, // Adjusted blog URL
      lastmod: new Date(blog.createdAt).toISOString(),
      changefreq: 'weekly',
      priority: '0.8',
    });
  });

  // Add dynamic category URLs
  const categories = await fetchCategories(); // Fetch categories
  categories.forEach((category) => {
    fields.push({
      loc: `${process.env.SITEMAP_URL}/categories/${category.slug}`, // Adjusted category URL
      lastmod: new Date().toISOString(),
      changefreq: 'weekly',
      priority: '0.6',
    });
  });

  // Generate the sitemap XML
  const sitemap = await getServerSideSitemap(fields);

  return new NextResponse(sitemap.body, {
    status: sitemap.status,
    headers: sitemap.headers,
  });
}
