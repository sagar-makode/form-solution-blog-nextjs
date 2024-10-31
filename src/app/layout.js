import "./globals.css";
import Header from "@/components/Header";
import { cx } from "@/utils";
import { Inter, Manrope } from "next/font/google";
import Footer from "../components/Footer";
import siteMetadata from "../utils/siteMetaData";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from '@vercel/speed-insights/next';

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-in",
});

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mr",
});



export const metadata = {
  metadataBase: new URL(siteMetadata.siteUrl),
  title: {
    template: `%s | ${siteMetadata.title}`,
    default: siteMetadata.title, // a default is required when creating a template
  },
  description: siteMetadata.description,
  keywords: ["formsolution", "onlineform", "sarkari yojana","latest Update"], // Custom tags
  openGraph: {
    title: siteMetadata.title,
    description: siteMetadata.description,
    url: siteMetadata.siteUrl,
    siteName: siteMetadata.title,
    images: [siteMetadata.socialBanner],
    locale: "en_US",
    type: "website",
    article: {
      tags: ["Blog", "Tech", "Updates"], // Open Graph article tags
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  twitter: {
    card: "summary_large_image",
    title: siteMetadata.title,
    images: [siteMetadata.socialBanner],
  },
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
       <head>
        {/* Example custom tags */}
        <meta name="keywords" content="formsolution,onlineform,sarkari yojana,latest Update" />
        <meta name="author" content="form solution" />
      </head>
    <body
     className={cx(
       inter.variable,
       manrope.variable,
       "font-mr bg-light dark:bg-dark"
     )}
   >
       <Script id="theme-switcher" strategy="beforeInteractive">
       {`if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
 document.documentElement.classList.add('dark')
} else {
 document.documentElement.classList.remove('dark')
}`}
     </Script>
     <Header />
     {children}
     <Analytics />
     <SpeedInsights />


     <Footer />

   </body>
 </html>
  );
}
