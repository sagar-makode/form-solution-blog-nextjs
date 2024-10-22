import React from "react";
import Tag from "../Elements/Tag";
import Link from "next/link";
import Image from "next/image";
import { slug } from "github-slugger";
import { extractImageFromHTML } from "../Home/extractImageFromHTML";

const BlogLayoutOne = ({ blog }) => {

  const imageSrc = extractImageFromHTML(blog?.content) || "https://res.cloudinary.com/dx09awqqv/image/upload/v1728469381/ss0en9wneflabphzhaz1.png"; // Fallback placeholder if no image found

  return (
    <div className="group inline-block overflow-hidden rounded-xl">
      <div
        className="absolute top-0 left-0 bottom-0 right-0 h-full
            bg-gradient-to-b from-transparent from-0% to-dark/90 rounded-xl z-10
            "
      />
      <Image
        src={imageSrc}
        // placeholder="blur"
        // blurDataURL={blog.image.blurhashDataUrl}
        alt={blog?.title}
        width={1920} // Use the actual width of the image
        height={1280} // Use the actual height of the image
        className="w-full h-full object-center object-cover rounded-xl group-hover:scale-105 transition-all ease duration-300"
        sizes="(max-width: 1180px) 100vw, 50vw"
      />

      <div className="w-full absolute bottom-0 p-4 xs:p-6 sm:p-10 z-20">
      <Tag link={`/categories/${slug(blog?.tag)}`} name={blog?.tag}
        className="px-6 text-xs  sm:text-sm py-1 sm:py-2 !border "
        />

        <Link  href={`/blogs/${slug(blog?.title)}`} className="mt-6">
          
          <h2 className="font-bold capitalize text-sm xs:text-base sm:text-xl md:text-2xl text-light mt-2 sm:mt-4">
            <span
              className="bg-gradient-to-r from-accent to-accent bg-[length:0px_6px] dark:from-accentDark/50 dark:to-accentDark/50
                group-hover:bg-[length:100%_6px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 "
            >
              {blog?.title}
            </span>
          </h2>
        </Link>
      </div>
    </div>
  );
};

export default BlogLayoutOne;
