import { connect } from "@/lib/db";
import Blog from "@/models/Blog";
import { NextResponse } from "next/server";

export async function GET(req) {  
  try {
    // Connect to database (will use cached connection if available)
    await connect();

    // Get the query parameters from the request URL
    const { searchParams } = new URL(req.url);
    const title = searchParams.get("title");

    let blogs;

    if (title) {
      blogs = await Blog.find({ title: { $regex: title, $options: 'i' } });
    } else {
      blogs = await Blog.find({});
    }

    // Convert to plain objects and handle dates
    const blogsWithStringDates = blogs.map(blog => {
      const blogObj = blog.toObject();
      
      // Convert Date objects to ISO strings
      if (blogObj.createdAt instanceof Date) {
        blogObj.createdAt = blogObj.createdAt.toISOString();
      }
      if (blogObj.updatedAt instanceof Date) {
        blogObj.updatedAt = blogObj.updatedAt.toISOString();
      }
      
      return blogObj;
    });

    return NextResponse.json(blogsWithStringDates);
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json(
      { message: "GET error", error: error.message },
      { status: 500 }
    );
  }
}