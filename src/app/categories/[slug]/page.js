
import BlogLayoutThree from "@/components/Blog/BlogLayoutThree";
import Categories from "@/components/Blog/Categories";
import { fetchBlogs } from "@/fetchblogs/fetchBlogs";
import { sortBlogs } from "@/utils";
import GithubSlugger, { slug as slugify } from "github-slugger";

const slugger = new GithubSlugger();

const CategoryPage = async ({ params }) => {
  let allBlogs = await fetchBlogs()
  const { slug } = await params



  // Collect all categories from the blogs
  const allCategories = ["all"]; // Initialize with 'all' category
 allBlogs.forEach((blog) => {
  if (blog?.tag) { // Check if blog and blog.tag exist
    const slugified = slugify(blog.tag);
    if (!allCategories.includes(slugified)) {
      allCategories.push(slugified);
    }
  }
  });

  

  // Sort categories alphabetically
  allCategories.sort();
  const decodedSlug = decodeURIComponent(slug); // Decode the URL-encoded slug


  // Step 2: Filter blogs based on the current category (params.slug)
  const filteredBlogs = allBlogs.filter((blog) => {
    if (decodedSlug === "all") {
      return true; // Include all blogs if 'all' category is selected
    }
    return blog?.tag && slugify(blog.tag) === decodedSlug;
  });

  
  const sortedBlogs = sortBlogs(filteredBlogs);  

  return (
    <article className="mt-12 flex flex-col text-dark dark:text-light">
      <div className="px-5 sm:px-10 md:px-24 sxl:px-32 flex flex-col">
        <h1 className="mt-6 font-semibold text-2xl md:text-4xl lg:text-5xl"># {decodedSlug}</h1>
        <span className="mt-2 inline-block">
          अधिक श्रेण्या शोधा आणि आपल्या ज्ञानाचा विस्तार करा!
        </span>
      </div>

      {/* Categories Component */}
      <Categories categories={allCategories} currentSlug={decodedSlug} />

      {/* Blog Listing */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16 mt-5 sm:mt-10 md:mt-24 sxl:mt-32 px-5 sm:px-10 md:px-24 sxl:px-32">
        {sortedBlogs.map((blog, index) => (
          <article key={index} className="col-span-1 row-span-1 relative">
            <BlogLayoutThree blog={blog} />
          </article>
        ))}
      </div>
    </article>
  );
};

export default CategoryPage;
