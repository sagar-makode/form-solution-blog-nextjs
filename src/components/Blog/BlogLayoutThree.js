import { format } from "date-fns";
import { slug } from "github-slugger";
import Image from "next/image";
import Link from "next/link";
import React from "react";

// Client-side only image extraction
const extractImageFromHTML = (htmlContent) => {
  if (typeof window !== "undefined") {
      const doc = new DOMParser().parseFromString(htmlContent, 'text/html');
      const img = doc.querySelector('img');
      return img ? img.src : null; // Return the src attribute of the first img tag
  }
  return null;
};

const BlogLayoutThree = ({ blog }) => {

   
  const imageSrc = extractImageFromHTML(blog.content) || "https://res.cloudinary.com/dx09awqqv/image/upload/v1728469381/ss0en9wneflabphzhaz1.png"

  return (
    <div className="group flex flex-col items-center text-dark dark:text-light">
      <Link  href={`/blogs/${slug(blog.title)}`} className="h-full rounded-xl overflow-hidden">
        <Image
          src={imageSrc}
          // placeholder="blur"
          // blurDataURL={blog.image.blurhashDataUrl}
          alt={blog.title}
      
          width={1920} // Use the actual width of the image
          height={1282} // Use the actual height of the image
          className=" aspect-[4/3] w-full h-full object-cover object-center  group-hover:scale-105 transition-all ease duration-300 "
          // sizes="(max-width: 640px) 100vw,(max-width: 1024px) 50vw, 33vw"
        />
      </Link>

      <div className="flex flex-col w-full mt-4">
        <span className="uppercase text-accent dark:text-accentDark font-semibold text-xs sm:text-sm">
          {blog.tag}
        </span>
        <Link href={`/blogs/${slug(blog.title)}`} className="inline-block my-1">
          <h2 className="font-semibold capitalize  text-base sm:text-lg">
            <span
              className="bg-gradient-to-r from-accent/50 to-accent/50  dark:from-accentDark/50
              dark:to-accentDark/50
              bg-[length:0px_6px]
              group-hover:bg-[length:100%_6px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 "
            >
              {blog.title}
            </span>
          </h2>
        </Link>

        <span className="capitalize text-gray dark:text-light/50 font-semibold text-sm  sm:text-base">
          {format(new Date(blog.createdAt), "MMMM dd, yyyy")}
        </span>
      </div>
    </div>
  );
};

export default BlogLayoutThree;
