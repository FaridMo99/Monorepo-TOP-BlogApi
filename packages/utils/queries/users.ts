import { UserUpdate } from "@monorepotopblogapi/schemas";
import { url } from "./posts";

type UserReturn = {
  isAdmin: boolean;
  username: string;
  id: string;
  email: string;
}

export async function getUsers(token:string):Promise<UserReturn[]> {
    const res = await fetch(`${url}/users`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization":`Bearer ${token}`
        }
    });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Something went wrong");
      }
      return res.json();
}

export async function getUserById(token: string, userId: string): Promise<UserReturn> {
  const res = await fetch(`${url}/users/${userId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Something went wrong");
  }
  return res.json();
}

export async function deleteUser(token: string, userId: string): Promise<UserReturn> {
  const res = await fetch(`${url}/users/${userId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Something went wrong");
  }
  return res.json();
}

export async function updateUser(
  token: string,
  userId: string,
  fields:UserUpdate
): Promise<UserReturn> {
  const res = await fetch(`${url}/users/${userId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(fields),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Something went wrong");
  }
  return res.json();
}
//add typescript