import { connect } from "@/lib/db";
import Blog from "@/models/Blog";
import { NextResponse } from "next/server";

export async function GET(req) {  
  await connect();


  try {
    // Get the query parameters from the request URL
    const { searchParams } = new URL(req.url);
    
    const title = searchParams.get("title"); // Get the title parameter

    let blogs;

    // If a title is provided, find blogs with that title
    if (title) {
      blogs = await Blog.find({ title: { $regex: title, $options: 'i' } }); // Case-insensitive search
    } else {
      // If no title is provided, return all blogs
      blogs = await Blog.find({});
    }

    return NextResponse.json(blogs);
  } catch (error) {
    console.error("GET error:", error); // Log the error for debugging
    return NextResponse.json(
      { message: "GET error" },
      {
        status: 500,
      }
    );
  }
}
