export async function fetchBlogs() {
    const res = await fetch("http://127.0.0.1:3000/api/blog", {cache: "no-store",});
    let data = await res.json()
    return data
}