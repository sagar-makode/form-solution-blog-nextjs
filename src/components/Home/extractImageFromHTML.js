import * as cheerio from 'cheerio';

const extractImageFromHTML = (htmlContent) => {
    // Load HTML content with Cheerio
    const $ = cheerio.load(htmlContent);
    // Select the first image element and get its 'src' attribute
    const imgSrc = $('img').attr('src');
    return imgSrc || null; // Return null if no image is found
};

export default extractImageFromHTML;
