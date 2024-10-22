export async function fetchBlogs() {
    const res = await fetch("http://localhost:3000/api/blog", {cache: "no-store",});
    let data = await res.json()
    return data
}