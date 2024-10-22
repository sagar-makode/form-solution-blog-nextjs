"use client"; // This line makes the component a Client Component

import { useEffect, useState } from "react";
import BlogLayoutThree from "@/components/Blog/BlogLayoutThree";
import Categories from "@/components/Blog/Categories";
import GithubSlugger, { slug } from "github-slugger";

const slugger = new GithubSlugger();

const CategoryPage = ({ params }) => {
  const [blogdata, setBlogdata] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch blogs from the API
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/blog", {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }

        const data = await res.json();
        setBlogdata(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching blogs:", error);
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return <p>Loading...</p>; // Show loading state
  }

  if (!blogdata || blogdata.length === 0) {
    return <p>No blogs found</p>; // Show a message if no blogs are found
  }

  // Collect all categories from the blogs
  const allCategories = ["all"]; // Initialize with 'all' category
  blogdata.forEach((blog) => {
    const slugified = slug(blog.tag); // Assuming each blog has a single tag
    if (!allCategories.includes(slugified)) {
      allCategories.push(slugified);
    }
  });

  // Sort categories alphabetically
  allCategories.sort();
  const decodedSlug = decodeURIComponent(params.slug); // Decode the URL-encoded slug


  // Step 2: Filter blogs based on the current category (params.slug)
  const filteredBlogs = blogdata.filter((blog) => {
    if (params.slug === "all") {
      return true; // Include all blogs if 'all' category is selected
    }
    return slug(blog.tag) === decodedSlug; // Match the single tag
  });
  console.log(decodedSlug);
  

  return (
    <article className="mt-12 flex flex-col text-dark dark:text-light">
      <div className="px-5 sm:px-10 md:px-24 sxl:px-32 flex flex-col">
        <h1 className="mt-6 font-semibold text-2xl md:text-4xl lg:text-5xl"># {decodedSlug}</h1>
        <span className="mt-2 inline-block">
        अधिक श्रेण्या शोधा आणि आपल्या ज्ञानाचा विस्तार करा!
                </span>
      </div>

      {/* Categories Component */}
      <Categories categories={allCategories} currentSlug={params.slug} />

      {/* Blog Listing */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16 mt-5 sm:mt-10 md:mt-24 sxl:mt-32 px-5 sm:px-10 md:px-24 sxl:px-32">
        {filteredBlogs.map((blog, index) => (
          <article key={index} className="col-span-1 row-span-1 relative">
            <BlogLayoutThree blog={blog} />
          </article>
        ))}
      </div>
    </article>
  );
};

export default CategoryPage;
