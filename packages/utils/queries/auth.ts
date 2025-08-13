import { url } from "./posts";
import { type Signup, type Login } from "@monorepotopblogapi/schemas";

type SafeUser = {
    username: string;
    isAdmin: boolean;
    token: string;
    email:string
}


//handle access token properly and refresh consistently
export async function login(credentials:Login):Promise<SafeUser> {
    const res = await fetch(`${url}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Something went wrong");
    }
    return res.json();
}

export async function signup(credentials: Signup):Promise<SafeUser> {
  const res = await fetch(`${url}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Something went wrong");
  }
  return res.json();
}

export async function getRefreshToken():Promise<SafeUser> {
    const res = await fetch(`${url}/auth/refreshToken`, {
        method: "POST",
        credentials: "include"
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Something went wrong");
    }
    return res.json();
}