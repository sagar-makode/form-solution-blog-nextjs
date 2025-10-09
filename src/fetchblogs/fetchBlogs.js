import { connect } from "@/lib/db";
import Blog from "@/models/Blog";

export async function fetchBlogs() {
    try {
        // This will use the cached connection
        await connect();
        
        const blogs = await Blog.find({}).sort({ createdAt: -1 });
        
        // Convert to plain objects and handle dates
        const blogsWithStringDates = blogs.map(blog => {
            const blogObj = blog.toObject();
            
            if (blogObj.createdAt instanceof Date) {
                blogObj.createdAt = blogObj.createdAt.toISOString();
            }
            if (blogObj.updatedAt instanceof Date) {
                blogObj.updatedAt = blogObj.updatedAt.toISOString();
            }
            
            return blogObj;
        });
        
        return blogsWithStringDates;
        
    } catch (error) {
        console.error("Error fetching blogs from database:", error);
        return [];
    }
}