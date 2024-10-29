export async function fetchBlogs() {

    try {
        console.log("start 1");
        
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}`, {cache: "no-store",});
        console.log("start 2",res);

        if (!res.ok) {
            const errorText = await res.text();
            console.error("Failed to fetch:", res.status, res.statusText, errorText);
            throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
        }
        let data = await res.json()
        return data
        
    } catch (error) {
        console.error("Error fetching blogs:", error);
        return null;
    }
}
