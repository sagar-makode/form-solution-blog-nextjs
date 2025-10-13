import { format } from "date-fns";
import { slug } from "github-slugger";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import extractImageFromHTML from "../Home/extractImageFromHTML";

const BlogLayoutThree = ({ blog }) => {

   
  const imageSrc = extractImageFromHTML(blog.content)

  return (
    <div className="group flex flex-col items-center text-dark dark:text-light">
      <Link  href={`/blog/${slug(blog.slug)}`} className="h-full rounded-xl overflow-hidden">
        {imageSrc && (
          <Image
            src={imageSrc}
            alt={blog.title || "Blog image"}
            width={1920}
            height={1282}
            className="aspect-[4/3] w-full h-full object-center group-hover:scale-105 transition-all ease duration-300"
          />
        )}
      </Link>

      <div className="flex flex-col w-full mt-4">
        <span className="uppercase text-accent dark:text-accentDark font-semibold text-xs sm:text-sm">
          {blog.category}
        </span>
        <Link href={`/blog/${slug(blog.slug)}`} className="inline-block my-1">
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
