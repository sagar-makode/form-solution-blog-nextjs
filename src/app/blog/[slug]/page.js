import { fetchBlogs } from "@/fetchblogs/fetchBlogs";
import BlogDetails from "../../../components/Blog/BlogDetails";
import siteMetadata from "../../../utils/siteMetaData";
import { slug as slugify } from "github-slugger"; // Renaming to avoid conflicts
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

  const decodedSlug = decodeURIComponent(slug); // Decode the URL-encoded characters

  const blog = allBlogs.find((blog) => {
    const slugifiedTitle = slugify(blog?.slug)

    return slugifiedTitle === decodedSlug;
  });

  if (!blog) {
    return;
  }

  const publishedAt = new Date(blog.createdAt).toISOString();


  // let imageList = [siteMetadata.socialBanner];

  if (!blog) return;

  const imageList = extractImageFromHTML(blog.content) || siteMetadata.socialBanner;
  const ogImages = [{ url: imageList.includes("http") ? imageList : `${siteMetadata.siteUrl}${imageList}` }];

  return {
    title: blog.title,
    openGraph: {
      title: blog.title,
      description: blog.description,
      url: `${siteMetadata.siteUrl}/blog/${slugify(decodedSlug)}`,
      siteName: siteMetadata.title,
      publishedTime: publishedAt,
      locale: "en_US",
      type: "article",
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
  const decodedSlug = decodeURIComponent(slug); // Decode the URL-encoded characters

  const blog = allBlogs.find((blog) => {
    const slugifiedTitle = slugify(blog?.slug)

    return slugifiedTitle === decodedSlug;
  });



  if (!blog) {
    notFound()
  }
  const latestBlogs = allBlogs
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)
    .map((latestBlog) => ({
      ...latestBlog,
      imageSrc: extractImageFromHTML(latestBlog.content), // Extract image src from content
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


  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": blog.title,
    "description": blog.description,
    "image": imageList,
    "datePublished": new Date(blog.publishedAt)
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article>

        <h1 className="text-2xl md:text-2xl font-bold gap-y-8 lg:gap-8 sxl:gap-16 mt-4 px-6 md:px-10 dark:text-white">
          {blog.title}
        </h1>
        <div className="grid grid-cols-12  gap-y-8 lg:gap-8 sxl:gap-16 mt-4 px-5 md:px-10">
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
              className="blog-content dark:text-white" // New class for your content
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </div>
          <div className="col-span-12  lg:col-span-4">

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
                    {/* Display the blog image */}
                    <div className="w-16 h-16 mr-4">
                      <Image
                        src={latestBlog.imageSrc || null}
                        alt={latestBlog.title || null}
                        className=" w-full h-full"
                        width={1920} // Use the actual width of the image
                        height={1280} // Use the actual height of the image

                      />
                    </div>
                    <a
                      href={`/blog/${slugify(latestBlog.slug)}`}
                      className="flex-grow text-left w-16 h-16 mr-4 overflow-hidden truncate"
                    >
                      {latestBlog.title}
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
