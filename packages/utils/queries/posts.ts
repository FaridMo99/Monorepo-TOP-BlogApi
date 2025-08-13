import {
  type Comment,
  type CommentReturn,
  type LikeComment,
  type BlogPost,
} from "@monorepotopblogapi/schemas";

type Action = {
  action: "like" | "unlike" | "publish" | "unpublish"
}


export const url = process.env.VITE_API_URL;

async function fetchWithAuth<T>(endpoint:string, token:string | null = null, options:RequestInit = {}):Promise<T> {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${url}/auth${endpoint}`, { ...options, headers });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Something went wrong");
  }
  return res.json();
}

export const getPosts = (query:string) => fetchWithAuth<BlogPost[]>(`/posts${query || ""}`);

export const getPostById = (postId:string) => fetchWithAuth<BlogPost>(`/posts/${postId}`);

export const createPost = (token: string, content:Omit<BlogPost, "id" | "createdAt">) =>
  fetchWithAuth<BlogPost>(`/posts`, token, {
    method: "POST",
    body: JSON.stringify(content),
  });

export const deletePost = (token: string, postId: string) =>
  fetchWithAuth<BlogPost>(`/posts/${postId}`, token, { method: "DELETE" });

export const updatePost = (token: string, postId: string, action: Action) =>
  fetchWithAuth<BlogPost>(`/posts/${postId}`, token, {
    method: "PATCH",
    body: JSON.stringify(action),
  });

export const createComment = (token: string, postId: string, comment: Comment) =>
  fetchWithAuth<CommentReturn>(`/posts/${postId}`, token, {
    method: "POST",
    body: JSON.stringify(comment),
  });

export const deleteComment = (token: string, postId: string, commentId: string) =>
  fetchWithAuth<Comment>(`/posts/${postId}/${commentId}`, token, { method: "DELETE" });

export const likeUnlikeComment = (token: string, postId: string, commentId: string) =>
  fetchWithAuth<LikeComment>(`/posts/${postId}/${commentId}`, token, { method: "PATCH" });
