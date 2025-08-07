import type { BlogPost } from "@monorepotopblogapi/schemas";


export async function getPosts(query?:string): Promise<BlogPost[]> {
  const res = await fetch(`http://localhost:3000/posts${query ?? ""}`);
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }
  const posts = await res.json();
  return posts;
}
