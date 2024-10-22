// utils/htmlUtils.js

export const extractImageFromHTML = (htmlContent, options = {}) => {
  if (typeof window !== 'undefined') {
    // Only run this code in the browser
    const doc = new DOMParser().parseFromString(htmlContent, 'text/html');

    if (options.all) {
      // If 'all' option is true, return an array of all image sources
      const images = Array.from(doc.querySelectorAll('img'));
      return images.map((img) => img.src);
    } else {
      // Otherwise, return the src of the first image
      const img = doc.querySelector('img');
      return img ? img.src : null; // Return the src attribute of the first img tag
    }
  }
  return null; // Return null during SSR
};

  
  // Example usage:
  // const firstImageSrc = extractImageFromHTML(htmlContent);
  // const allImageSrcs = extractImageFromHTML(htmlContent, { all: true });
  