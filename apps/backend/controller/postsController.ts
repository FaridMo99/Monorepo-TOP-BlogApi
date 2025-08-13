import z, { treeifyError } from "zod";
import prisma from "../db/prismaClient";
import { BlogPost, User } from "../generated/prisma";
import { blogPostSchema, updatePostSchema } from "@monorepotopblogapi/schemas";
import { NextFunction, Request, Response } from "express";

export async function getAllPosts(req: Request, res: Response, next: NextFunction) {
  const user = req.user ?? {isAdmin:false};
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
      ...(user.isAdmin
        ? {}
        : {
            where: { isPublic: true },
          }),
    });

    return res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
}

export async function getPostById(req: Request, res: Response, next: NextFunction) {
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

export async function createPost(req: Request, res: Response, next: NextFunction) {
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
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Validation failed",
        errors: treeifyError(error),
      });
    }

    next(error);
  }
}


export async function deletePostById(req: Request, res: Response, next: NextFunction) {
  try {
    const { postId } = req.params;
    if (!postId) return res.status(400).json({ message: "Post not found" });

    const deletedPost: BlogPost | null = await prisma.blogPost.delete({
      where: {
        id: postId,
      },
    });
    if (!deletedPost)
      return res.status(400).json({ message: "Post not found" });

    res.status(200).json(deletedPost);
  } catch (error) {
    next(error);
  }
}

export async function updatePostById(req: Request, res: Response, next: NextFunction) {
  try {
    const user = req.user as User;
    const { action }: PostAction = req.body;

    const { postId } = req.params;
    if (!postId || !action)
      return res.status(400).json({ message: "No Post or Action found" });

    const saveFields = updatePostSchema.parse({
      blogpostId: postId,
      userId: user.id,
      isAdmin: user.isAdmin,
    });
    if (!saveFields.isAdmin && (action === "publish" || action === "unpublish"))
      return res.status(401).json({ message: "Unauthorized" });

    if (
      saveFields.isAdmin &&
      (action === "publish" || action === "unpublish")
    ) {
      const post = await prisma.blogPost.update({
        where: {
          id: postId,
        },
        data: {
          isPublic: action === "publish" ? true : false,
        },
      });
      if (post) return res.status(200).json(post);
      else return res.status(500);
    }
    if (action === "like" || action === "unlike") {
      const toggleAction = action === "like" ? "connect" : "disconnect";
      const post = await prisma.blogPost.update({
        where: {
          id: postId,
        },
        data: {
          likes: {
            [toggleAction]: { id: user.id },
          },
        },
      });
      if (post) {
        return res.status(200).json(post);
      } else {
        return res.sendStatus(500);
      }
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Validation failed",
        errors: treeifyError(error),
      });
    }

    next(error);
  }
}

export async function deleteCommentByPostIdAndCommentId(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.user as User;
    const { postId, commentId } = req.params;

    if (!user.id || !postId || !commentId) {
      return res.status(404).json({ message: "Not Found" });
    }

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { userId: true, blogPostId: true },
    });

    if (!comment || comment.blogPostId !== postId) {
      return res.status(404).json({ message: "Not Found" });
    }

    if (comment.userId !== user.id && !user.isAdmin) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const deletedComment = await prisma.comment.delete({
      where: { id: commentId },
    });

    return res.status(200).json(deletedComment);
  } catch (error) {
    next(error);
  }
}

export async function toggleLikeByPostIdAndCommentId(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.user as User;
    const { postId, commentId } = req.params;

    if (!user.id || !postId || !commentId) {
      return res.status(404).json({ message: "Not Found" });
    }

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      include: { likes: { select: { id: true } } },
    });

    if (!comment || comment.blogPostId !== postId) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const alreadyLiked = comment.likes.some((like) => like.id === user.id);

    const updatedComment = await prisma.comment.update({
      where: { id: commentId },
      data: {
        likes: alreadyLiked
          ? { disconnect: { id: user.id } }
          : { connect: { id: user.id } },
      },
      include: { likes: true },
    });

    return res.status(200).json(updatedComment);
  } catch (error) {
    next(error);
  }
}

export async function createComment(req: Request, res: Response, next: NextFunction) {
  try {
    const content = req.body;
    const { postId } = req.params;
    const user = req.user as User;
    if (!user || !postId || !content) return res.status(404).json("Not Found");

    const comment = await prisma.comment.create({
      data: {
        blogPost: { connect: { id: postId } },
        user: { connect: { id: user.id } },
        content,
      },
      include: {
        user: true,
      },
    });
    if (!comment) return res.status(500);
    return res.status(200).json(comment);
  } catch (error) {
    next(error);
  }
}

type PostAction = { action: "like" |"unlike" | "publish" |"unpublish"}