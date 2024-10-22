import { connect } from "@/lib/db";
import Blog from "@/models/Blog";
import { NextResponse } from "next/server";




export async function GET(req) {
    await connect();
  
    try {
      const blogs = await Blog.find({})
      
  
        return NextResponse.json(blogs);
    } catch (error) {
      return NextResponse.json(
        { message: "GET error" },
        {
          status: 500,
        }
      );
    }
  }