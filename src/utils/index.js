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
      const dateA = a.createdAt ? parseISO(a.createdAt) : new Date(0); // Fallback to epoch if undefined
      const dateB = b.createdAt ? parseISO(b.createdAt) : new Date(0); // Fallback to epoch if undefined
      return compareDesc(dateA, dateB);
    });
};
