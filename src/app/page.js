import FeaturedPosts from "@/components/Home/FeaturedPosts";
import HomeCoverSection from "@/components/Home/HomeCoverSection";
import RecentPosts from "@/components/Home/RecentPosts";
import { fetchBlogs } from "@/fetchblogs/fetchBlogs";
import Image from "next/image";
export const dynamic = 'force-dynamic';

export default async function Home() {

  let allblogs = await fetchBlogs();
  
  return (
    <main className="flex flex-col items-center justify-center">

      <HomeCoverSection blogs={allblogs} />
    
      <FeaturedPosts blogs={allblogs} />
      <RecentPosts blogs={allblogs} />



    </main>
  );
}
