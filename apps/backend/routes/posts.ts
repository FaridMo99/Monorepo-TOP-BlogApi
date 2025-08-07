import { Router } from "express";
import prisma from "../db/prismaClient";
import { BlogPost } from "../generated/prisma";
import { blogPostSchema } from "@monorepotopblogapi/schemas";
import z from "zod";
import { createPost, getAllPosts, getPostById } from "../controller/postsController";
import { authMiddleware } from "../middleware/middleware";


//auth middleware only checks if you logged in
//but not if you the actual user that is allowed
//to do this action or maybe it does check it out
const postsRouter = Router();

//get all posts
postsRouter.get("/",getAllPosts);

//get single post
postsRouter.get("/:postId",getPostById);

//create post
postsRouter.post("/",authMiddleware,createPost);

//delete post
postsRouter.delete("/:postId",authMiddleware, async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

//update post (publish, unpublish) and like
postsRouter.patch("/:postId",authMiddleware, async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
});

//commenting
postsRouter.post("/:postId",authMiddleware, async (req, res, next) => {
  try {
  } catch (error) {}
});

//delete comment
postsRouter.delete("/:postId/:commentId",authMiddleware, async (req, res, next) => {
  try {
  } catch (error) {}
});

//like/unlike comment
postsRouter.patch("/:postId/:commentId",authMiddleware, async (req, res, next) => {
  try {
  } catch (error) {}
});

export default postsRouter;
