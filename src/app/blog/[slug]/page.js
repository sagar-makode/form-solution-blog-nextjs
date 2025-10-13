import { fetchBlogs } from "@/fetchblogs/fetchBlogs";
import siteMetadata from "../../../utils/siteMetaData";
import { slug as slugify } from "github-slugger";
import Image from "next/image";
import { notFound } from "next/navigation";
import extractImageFromHTML from "@/components/Home/extractImageFromHTML";
import { format } from "date-fns";

export async function generateStaticParams() {
  let allBlogs = await fetchBlogs()
  return allBlogs.map((blog) => ({ slug: slugify(blog.slug) }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  let allBlogs = await fetchBlogs()

  const decodedSlug = decodeURIComponent(slug);

  const blog = allBlogs.find((blog) => {
    const slugifiedTitle = slugify(blog?.slug)
    return slugifiedTitle === decodedSlug;
  });

  if (!blog) {
    return;
  }

  const publishedAt = new Date(blog.createdAt).toISOString();
  const canonicalUrl = `${siteMetadata.siteUrl}/blog/${slugify(blog.slug)}`;

  const imageList = extractImageFromHTML(blog.content) || siteMetadata.socialBanner;
  const ogImages = [{ 
    url: imageList.includes("http") ? imageList : `${siteMetadata.siteUrl}${imageList}` 
  }];

  // Get tags from blog data
  const blogTags = blog.tags || [];
  const keywords = blogTags.join(', ');

  return {
    title: blog.title,
    description: blog.description,
    keywords: keywords, // Add tags as keywords for SEO
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: blog.title,
      description: blog.description,
      url: canonicalUrl,
      siteName: siteMetadata.title,
      publishedTime: publishedAt,
      locale: "mr_IN", // Updated to match your site language
      type: "article",
      tags: blogTags, // Add tags array to OpenGraph
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description: blog.description,
    },
  };
}

export default async function BlogPage({ params }) {
  const { slug } = await params

  let allBlogs = await fetchBlogs();
  const decodedSlug = decodeURIComponent(slug);

  const blog = allBlogs.find((blog) => {
    const slugifiedTitle = slugify(blog?.slug)
    return slugifiedTitle === decodedSlug;
  });

  if (!blog) {
    notFound()
  }

  // Get tags from blog data (still needed for metadata and JSON-LD)
  const blogTags = blog.tags || [];

  const latestBlogs = allBlogs
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)
    .map((latestBlog) => ({
      ...latestBlog,
      imageSrc: extractImageFromHTML(latestBlog.content),
    }));

  let imageList = [siteMetadata.socialBanner];
  if (blog.content) {
    let imageList = extractImageFromHTML(blog.content);
    imageList =
      typeof imageList === "string"
        ? [siteMetadata.siteUrl + imageList.replace("../public", "")]
        : blog.image;
  }
  const ogImages = imageList.map((img) => {
    return { url: img.includes("http") ? img : siteMetadata.siteUrl + img };
  });

  const canonicalUrl = `${siteMetadata.siteUrl}/blog/${slugify(blog.slug)}`;

  // Updated JSON-LD with tags
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": blog.title,
    "description": blog.description,
    "image": imageList,
    "datePublished": new Date(blog.createdAt).toISOString(),
    "dateModified": new Date(blog.updatedAt || blog.createdAt).toISOString(),
    "author": {
      "@type": "Organization",
      "name": siteMetadata.title
    },
    "publisher": {
      "@type": "Organization",
      "name": siteMetadata.title,
      "logo": {
        "@type": "ImageObject",
        "url": `${siteMetadata.siteUrl}/logo.png`
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": canonicalUrl
    },
    "keywords": blogTags.join(', '), // Add tags as keywords
    "articleSection": blogTags // Add tags as article sections
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article>
        {/* Blog Header with Title, Date - Tags section removed */}
        <div className="px-6 md:px-10 mt-4">
          <h1 className="text-2xl md:text-3xl font-bold dark:text-white mb-4">
            {blog.title}
          </h1>
          
          {/* Publication Date */}
          <div className="text-gray-600 dark:text-gray-400 text-sm mb-6">
            Published on {format(new Date(blog.createdAt), "MMMM dd, yyyy")}
          </div>

          {/* Tags Section REMOVED - No longer displayed on screen */}
        </div>

        <div className="grid grid-cols-12 gap-y-8 lg:gap-8 sxl:gap-16 mt-4 px-5 md:px-10">
          <div className="col-span-12 lg:col-span-8 font-in prose prose-sm md:prose-lg w-full
    prose-blockquote:bg-accent/20 
    prose-blockquote:p-2
    prose-blockquote:px-6
    prose-blockquote:border-accent
    prose-blockquote:not-italic
    prose-blockquote:rounded-r-lg
    prose-li:marker:text-accent
    dark:prose-invert
    dark:prose-blockquote:border-accentDark
    dark:prose-blockquote:bg-accentDark/20
    dark:prose-li:marker:text-accentDark
    first-letter:text-3xl
    sm:first-letter:text-5xl
">
            <div
              className="blog-content dark:text-white"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </div>
          <div className="col-span-12 lg:col-span-4">
            <details
              className="border-[1px] border-solid border-dark dark:border-light text-dark dark:text-light rounded-lg p-4 sticky top-6 max-h-[80vh] overflow-hidden overflow-y-auto"
              open
            >
              <summary className="text-lg font-semibold capitalize cursor-pointer">
                Latest post
              </summary>
              <ul className="mt-4 font-in text-base">
                {latestBlogs.map((latestBlog) => (
                  <li key={latestBlog._id} className="flex items-center mb-4">
                    <div className="w-16 h-16 mr-4">
                      {latestBlog.imageSrc && (
                        <Image
                          src={latestBlog.imageSrc}
                          alt={latestBlog.title || "Blog image"}
                          className="w-full h-full"
                          width={1920}
                          height={1280}
                        />
                      )}
                    </div>
                    <a
                      href={`/blog/${slugify(latestBlog.slug)}`}
                      className="flex-grow text-left overflow-hidden"
                    >
                      <div className="font-medium line-clamp-2 hover:text-accent dark:hover:text-accentDark">
                        {latestBlog.title}
                      </div>
                      <div className="text-sm text-gray-500 whitespace-nowrap">
                        {format(new Date(latestBlog.createdAt), "MMMM dd, yyyy")}
                      </div>
                    </a>
                  </li>
                ))}
              </ul>

            </details>
          </div>
        </div>
      </article>
    </>
  );
}
