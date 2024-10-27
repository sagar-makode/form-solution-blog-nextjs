export async function fetchAllBlogs() {
  const res = await fetch("https://form-solution.vercel.app/api/blogs");
  

  if (!res.ok) {
    throw new Error(`Failed to fetch blogs: ${res.status}`);
  }

  return await res.json();
}
