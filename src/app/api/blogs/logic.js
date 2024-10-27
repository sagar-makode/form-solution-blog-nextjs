export async function fetchAllBlogs() {
  const res = await fetch("http://127.0.0.1:3000/api/blogs");
  

  if (!res.ok) {
    throw new Error(`Failed to fetch blogs: ${res.status}`);
  }

  return await res.json();
}