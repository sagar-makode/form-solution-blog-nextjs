export async function fetchBlogs() {
    const res = await fetch("https://form-solution.vercel.app/api/blog", {cache: "no-store",});
    let data = await res.json()
    return data
}
