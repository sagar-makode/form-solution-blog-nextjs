import { fetchBlogs } from "@/fetchblogs/fetchBlogs";
import BlogDetails from "../../../components/Blog/BlogDetails";
import siteMetadata from "../../../utils/siteMetaData";
import { slug } from "github-slugger";
import Image from "next/image";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  let allBlogs = await fetchBlogs()

  return allBlogs.map((blog) => ({ slug: slug(blog.title) }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  let allBlogs = await fetchBlogs()

const blog = allBlogs.find((blog) =>{
  const slugifiedTitle = blog.title.toLowerCase().replace(/\s+/g, '-');
  return slugifiedTitle === slug.toLowerCase()} )
  if (!blog) {
    return;
  }

  // const publishedAt = new Date(blog.createdAt).toISOString();
  // const modifiedAt = new Date(blog.updatedAt || blog.publishedAt).toISOString();

  // let imageList = [siteMetadata.socialBanner];
  // if (blog.image) {
  //   imageList =
  //     typeof blog.image.filePath === "string"
  //       ? [siteMetadata.siteUrl + blog.image.filePath.replace("../public", "")]
  //       : blog.image;
  // }
  // const ogImages = imageList.map((img) => {
  //   return { url: img.includes("http") ? img : siteMetadata.siteUrl + img };
  // });

  const authors = blog?.author ? [blog.author] : siteMetadata.author;

  return {
    title: blog.title,
    description: blog.description,
    openGraph: {
      title: blog.title,
      description: blog.description,
      url: siteMetadata.siteUrl + blog.url,
      siteName: siteMetadata.title,
      locale: "en_US",
      type: "article",
      authors: authors.length > 0 ? authors : [siteMetadata.author],
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
  console.log(allBlogs);
  

  const blog = allBlogs.find((blog) => {
    const slugifiedTitle = blog.title.toLowerCase().replace(/\s+/g, '-');
    return slugifiedTitle === slug.toLowerCase()

  });

  if (!blog) {
    notFound()
  }


  let imageList = [siteMetadata.socialBanner];
  // if (blog.image) {
  //   imageList =
  //     typeof blog.image.filePath === "string"
  //       ? [siteMetadata.siteUrl + blog.image.filePath.replace("../public", "")]
  //       : blog.image;
  // }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": blog.title,
    "description": blog.description,
    "image": imageList,
    "datePublished": new Date(blog.publishedAt),
    "dateModified": new Date(blog.updatedAt || blog.publishedAt),
    "author": [{
      "@type": "Person",
      "name": blog?.author ? [blog.author] : siteMetadata.author,
      "url": siteMetadata.twitter,
    }]
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article>
       
        <BlogDetails blog={blog} slug={slug} />

        <div className="grid grid-cols-12  gap-y-8 lg:gap-8 sxl:gap-16 mt-8 px-5 md:px-10">
          
        <div className='col-span-12  lg:col-span-8 font-in prose sm:prose-base md:prose-lg max-w-max
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
    


    '>
<div
                                                        dangerouslySetInnerHTML={{ __html: blog.content }} />

          Danfjknjknfkjdnskjnfjk kj njknjknjnfjkndkjnkjnsjaknfkjanfjkn kfjnajknfj
        </div>
          <div className="col-span-12  lg:col-span-4">
            
            <details
              className="border-[1px] border-solid border-dark dark:border-light text-dark dark:text-light rounded-lg p-4 sticky top-6 max-h-[80vh] overflow-hidden overflow-y-auto"
              open
            >
              <summary className="text-lg font-semibold capitalize cursor-pointer">
                Table Of Content
              </summary>
              <ul className="mt-4 font-in text-base">
                <li>JHi</li>
                <li>JHi</li>

                <li>JHi</li>

                <li>JHi</li>

                <li>JHi</li>


              </ul>

            </details>
          </div>
        </div>
      </article>
    </>
  );
}
