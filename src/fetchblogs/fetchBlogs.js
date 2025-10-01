import { connect } from "@/lib/db";
import Blog from "@/models/Blog";

export async function fetchBlogs() {
    try {
        await connect();
        
        const blogs = await Blog.find({});
        
        // Convert Date objects to ISO strings
        const blogsWithStringDates = blogs.map(blog => {
            const blogData = blog.toObject ? blog.toObject() : blog;
            
            // Convert Date objects to ISO strings
            if (blogData.createdAt instanceof Date) {
                blogData.createdAt = blogData.createdAt.toISOString();
            }
            if (blogData.updatedAt instanceof Date) {
                blogData.updatedAt = blogData.updatedAt.toISOString();
            }
            
            return blogData;
        });
        
        return blogsWithStringDates;
        
    } catch (error) {
        console.error("Error fetching blogs from database:", error);
        return null;
    }
}