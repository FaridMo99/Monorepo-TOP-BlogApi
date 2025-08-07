import z from "zod";
import prisma from "../db/prismaClient";
import { BlogPost } from "../generated/prisma";
import { blogPostSchema } from "@monorepotopblogapi/schemas";

export async function getAllPosts(req,res,next) {
      //only send the ones that are isPublic for public routes and all for admin
  //dashboard
  try {
    const sort =
      req.query.sort === "asc"
        ? "asc"
        : req.query.sort === "desc"
          ? "desc"
          : undefined;
    const limit = req.query.limit
      ? parseInt(req.query.limit as string)
      : undefined;

    const posts = await prisma.blogPost.findMany({
      ...(sort && {
        orderBy: {
          createdAt: sort,
        },
      }),
      ...(limit && { take: limit }),
    });

    return res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
}

export async function getPostById(req,res,next) {
      try {
        const { postId } = req.params;
        const post: BlogPost | null = await prisma.blogPost.findUnique({
          where: {
            id: postId,
          },
        });

        if (!post) {
          return res.status(404).json({ message: "Post not found" });
        }

        return res.status(200).json(post);
      } catch (error) {
        next(error);
      }
}

export async function createPost(req,res,next) {
      try {
        const blogPostVals: z.infer<typeof blogPostSchema> = req.body;
        const { title, text, userId, layout, isPublic } =
          blogPostSchema.parse(blogPostVals);

        const data: BlogPost = await prisma.blogPost.create({
          data: {
            title,
            text,
            userId,
            ...(layout !== undefined ? { layout } : {}),
            ...(typeof isPublic === "boolean" ? { isPublic } : {}),
          },
        });

        return res.status(201).json(data);
      } catch (error) {
        next(error);
      }
}