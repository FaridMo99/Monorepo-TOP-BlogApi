import { z } from "zod";

export type BlogPost = z.infer<typeof blogPostSchema>;

const usernameRegex = /^(?=.*[a-z])(?=.*[A-Z]).{5,}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{5,}$/;

const usernameSchema = z
  .string("Username needs at least 5 characters")
  .min(5, "Username needs at least 5 characters")
  .regex(
    usernameRegex,
    "Username must include at least one uppercase and one lowercase letter",
  );

const passwordSchema = z
  .string("Password needs at least 5 characters")
  .min(5, "Password needs at least 5 characters")
  .regex(
    passwordRegex,
    "Password must include at least one uppercase letter, one lowercase letter, and one number",
  );

export const loginSchema = z.object({
  username: usernameSchema,
  password: passwordSchema,
});

export const signupSchema = z.object({
  username: usernameSchema,
  email: z.email("Invalid email"),
  password: passwordSchema,
});

const layoutEnum = z.enum(["STANDARD", "FEATURED", "GALLERY"]);

export const blogPostSchema = z.object({
  title: z.string("Field required").nonempty("Field required"),
  text: z.string("Field required").nonempty("Field required"),
  layout: layoutEnum.optional(),
  isPublic: z.boolean().optional(),
  userId: z.string(),
});

export const commentSchema = z.object({
  blogPostId: z.string(),
  userId: z.string(),
});

export const userSchema = z.object({
  id: z.string(),
  username: usernameSchema,
  email: z.email(),
  password: passwordSchema,
  isAdmin: z.boolean(),
});

export const userUpdateSchema = z.object({
  username: usernameSchema.optional(),
  email: z.email("Invalid email").optional(),
  password: passwordSchema.optional(),
  isAdmin: z.boolean().optional(),
});
