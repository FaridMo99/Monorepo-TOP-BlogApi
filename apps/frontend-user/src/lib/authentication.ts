import type {
  loginSchema,
  signupSchema,
  userSchema,
} from "@monorepotopblogapi/schemas";
import type z from "zod";

export type SignupFormData = z.infer<typeof signupSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type AuthFunctionReturn = Promise<z.infer<typeof userSchema>>;

export async function signup(formData: SignupFormData): AuthFunctionReturn {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/signup/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Something went wrong");
  }

  const user = await res.json();
  return user;
}

export async function login(formData: LoginFormData): AuthFunctionReturn {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Something went wrong");
  }

  const user = await res.json();
  return user;
}
