import { z } from "zod";

export type BlogPost = z.infer<typeof blogPostSchema> & { id: string; createdAt: string; };
export type Login = z.infer<typeof loginSchema>
export type Signup = z.infer<typeof signupSchema>
export type UserUpdate = z.infer<typeof userUpdateSchema>
export type Comment = z.infer<typeof commentSchema>;
export type CommentReturn = {
    user: {
        username: string;
        password: string;
        email: string;
        isAdmin: boolean;
        id: string;
    };
} & {
    userId: string;
    blogPostId: string;
    id: string;
    createdAt: Date;
    content: string;
}

export type LikeComment = {
    likes: {
        username: string;
        password: string;
        email: string;
        isAdmin: boolean;
        id: string;
    }[];
} & {
    userId: string;
    blogPostId: string;
    id: string;
    createdAt: Date;
    content: string;
}



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
  layout: layoutEnum.default("STANDARD"),
  isPublic: z.boolean().default(false),
  userId: z.string(),
});

export const commentSchema = z.object({
  blogPostId: z.string(),
  userId: z.string(),
  comment:z.string()
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

export const updatePostSchema = commentSchema.extend({
  isAdmin:z.boolean()
})