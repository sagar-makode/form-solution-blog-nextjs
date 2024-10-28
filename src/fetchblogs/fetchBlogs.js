export async function fetchBlogs() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blogs`, {cache: "no-store",});
    let data = await res.json()
    return data
}
