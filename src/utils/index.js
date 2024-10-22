import { compareDesc, parseISO } from "date-fns";

export const cx = (...classNames) => classNames.filter(Boolean).join(" ");

// export const sortBlogs = (blogs) => {
//   return blogs
//     .slice()
//     .sort((a, b) =>
//       compareDesc(parseISO(a?.publishedAt), parseISO(b?.publishedAt))
//     );
// };

export const sortBlogs = (blogs) => {
  return blogs
    .slice()
    .sort((a, b) => {
      const dateA = a.publishedAt ? parseISO(a.publishedAt) : new Date(0); // Fallback to epoch if undefined
      const dateB = b.publishedAt ? parseISO(b.publishedAt) : new Date(0); // Fallback to epoch if undefined
      return compareDesc(dateA, dateB);
    });
};
