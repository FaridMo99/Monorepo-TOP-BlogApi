import { Router } from "express";
import prisma from "../db/prismaClient";
import { BlogPost } from "../generated/prisma";
import { blogPostSchema } from "@monorepotopblogapi/schemas";
import z from "zod";
import { createPost, getAllPosts, getPostById } from "../controller/postsController";
import { authenticateToken } from "../middleware/middleware";


//auth middleware only checks if you logged in
//but not if you the actual user that is allowed
//to do this action or maybe it does check it out
const postsRouter = Router();

//get all posts
postsRouter.get("/",getAllPosts);

//get single post
postsRouter.get("/:postId",getPostById);

//create post
postsRouter.post("/", authenticateToken, createPost);

//delete post
postsRouter.delete("/:postId", authenticateToken, async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

//update post (publish, unpublish) and like
postsRouter.patch("/:postId", authenticateToken, async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

//commenting
postsRouter.post("/:postId", authenticateToken, async (req, res, next) => {
  try {
  } catch (error) {}
});

//delete comment
postsRouter.delete(
  "/:postId/:commentId",
  authenticateToken,
  async (req, res, next) => {
    try {
    } catch (error) {}
  }
);

//like/unlike comment
postsRouter.patch(
  "/:postId/:commentId",
  authenticateToken,
  async (req, res, next) => {
    try {
    } catch (error) {}
  }
);

export default postsRouter;
