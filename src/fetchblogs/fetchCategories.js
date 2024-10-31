import { slug as slugify } from "github-slugger";
import { fetchBlogs } from "./fetchBlogs";

// Example function to fetch categories based on tags from your blog data
export async function fetchCategories() {
  const blogs = await fetchBlogs(); // Fetch all blogs
  const categories = [...new Set(blogs.map(blog => blog.tag))]; // Assuming blogs have a tag field

  return categories.map(category => ({
    name: category,
    slug: slugify(category),
  }));
}
