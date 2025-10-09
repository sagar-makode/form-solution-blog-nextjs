import BlogLayoutThree from "@/components/Blog/BlogLayoutThree";
import Categories from "@/components/Blog/Categories";
import { fetchBlogs } from "@/fetchblogs/fetchBlogs";
import { sortBlogs } from "@/utils";
import { slug as slugify } from "github-slugger";
import siteMetadata from "@/utils/siteMetaData";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  let allBlogs = await fetchBlogs();
  
  // Get all unique categories from the single 'tag' field
  const allCategories = new Set(["all"]);
  
  allBlogs.forEach((blog) => {
    if (blog?.tag) {
      const slugified = slugify(blog.tag);
      allCategories.add(slugified);
    }
  });

  return Array.from(allCategories).map((category) => ({
    slug: category,
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  let allBlogs = await fetchBlogs();
  const decodedSlug = decodeURIComponent(slug);

  // Get proper category name for display
  const getCategoryDisplayName = (slug) => {
    if (slug === "all") return "सर्व लेख";
    
    // Find the original tag name from any blog
    for (let blog of allBlogs) {
      if (blog?.tag && slugify(blog.tag) === slug) {
        return blog.tag; // Return the original tag name
      }
    }
    
    // Fallback: convert slug to readable format
    return slug.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const categoryName = getCategoryDisplayName(decodedSlug);
  
  // Count blogs in this category using single 'tag' field
  const blogCount = allBlogs.filter((blog) => {
    if (decodedSlug === "all") return true;
    return blog?.tag && slugify(blog.tag) === decodedSlug;
  }).length;

  // Use proper slug for canonical URL (not decoded)
  const canonicalUrl = `${siteMetadata.siteUrl}/categories/${slug}`;

  // Clean title without duplication
  const pageTitle = `${categoryName}`;

  return {
    title: pageTitle,
    description: `${categoryName} - ${blogCount} लेख उपलब्ध आहेत. ${siteMetadata.description}`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: pageTitle, // Use the same cleaned title
      description: `${categoryName} - ${blogCount} लेख उपलब्ध आहेत`,
      url: canonicalUrl,
      siteName: siteMetadata.title, // Only the site name, not full title
      locale: "mr_IN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle, // Use the same cleaned title
      description: `${categoryName} - ${blogCount} लेख उपलब्ध आहेत`,
    },
  };
}

const CategoryPage = async ({ params }) => {
  let allBlogs = await fetchBlogs();
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  // Collect all categories from the single 'tag' field
  const allCategories = new Set(["all"]);
  
  allBlogs.forEach((blog) => {
    if (blog?.tag) {
      const slugified = slugify(blog.tag);
      allCategories.add(slugified);
    }
  });

  // Convert Set to Array and sort
  const sortedCategories = Array.from(allCategories).sort();

  // Filter blogs based on the current category using single 'tag' field
  const filteredBlogs = allBlogs.filter((blog) => {
    if (decodedSlug === "all") {
      return true;
    }
    return blog?.tag && slugify(blog.tag) === decodedSlug;
  });

  if (filteredBlogs.length === 0 && decodedSlug !== "all") {
    notFound();
  }

  const sortedBlogs = sortBlogs(filteredBlogs);

  // Get display name for category
  const getCategoryDisplayName = (slug) => {
    if (slug === "all") return "सर्व";
    
    // Find the original tag name from any blog
    for (let blog of allBlogs) {
      if (blog?.tag && slugify(blog.tag) === slug) {
        return blog.tag; // Return the original tag name
      }
    }
    
    // Fallback: convert slug to readable format
    return slug.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const displayName = getCategoryDisplayName(decodedSlug);
  
  // Use the original slug for canonical URL (not decoded)
  const canonicalUrl = `${siteMetadata.siteUrl}/categories/${slug}`;

  return (
    <article className="mt-12 flex flex-col text-dark dark:text-light">
      <div className="px-5 sm:px-10 md:px-24 sxl:px-32 flex flex-col">
        <h1 className="mt-6 font-semibold text-2xl md:text-4xl lg:text-5xl">
          # {displayName}
        </h1>
        <span className="mt-2 inline-block text-lg">
          {filteredBlogs.length} लेख सापडले
          {decodedSlug !== "all" && ` "${displayName}" श्रेणीमध्ये`}
        </span>
        <span className="mt-2 inline-block text-gray-600 dark:text-gray-400">
          अधिक श्रेण्या शोधा आणि आपल्या ज्ञानाचा विस्तार करा!
        </span>
      </div>

      {/* Categories Component */}
      <Categories 
        categories={sortedCategories} 
        currentSlug={decodedSlug} 
      />

      {/* Blog Listing */}
      {sortedBlogs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16 mt-5 sm:mt-10 md:mt-24 sxl:mt-32 px-5 sm:px-10 md:px-24 sxl:px-32">
          {sortedBlogs.map((blog, index) => (
            <article key={blog._id || index} className="col-span-1 row-span-1 relative">
              <BlogLayoutThree blog={blog} />
            </article>
          ))}
        </div>
      ) : (
        <div className="px-5 sm:px-10 md:px-24 sxl:px-32 mt-10 text-center">
          <p className="text-xl text-gray-600 dark:text-gray-400">
            या श्रेणीमध्ये अद्याप कोणतेही लेख उपलब्ध नाहीत.
          </p>
        </div>
      )}

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": `${displayName} श्रेणी`,
            "description": `${displayName} श्रेणीतील लेख - ${filteredBlogs.length} लेख उपलब्ध`,
            "url": canonicalUrl,
            "mainEntity": {
              "@type": "ItemList",
              "numberOfItems": filteredBlogs.length,
              "itemListElement": filteredBlogs.slice(0, 10).map((blog, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                  "@type": "Article",
                  "headline": blog.title,
                  "url": `${siteMetadata.siteUrl}/blog/${slugify(blog.slug)}`,
                  "description": blog.description,
                  "datePublished": new Date(blog.createdAt).toISOString(),
                  "author": {
                    "@type": "Organization",
                    "name": siteMetadata.title
                  }
                }
              }))
            }
          })
        }}
      />
    </article>
  );
};

export default CategoryPage;