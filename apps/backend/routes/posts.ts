import { Router } from "express";
import { createComment, createPost, deleteCommentByPostIdAndCommentId, deletePostById, getAllPosts, getPostById, toggleLikeByPostIdAndCommentId, updatePostById } from "../controller/postsController";
import { adminAuthorizationMiddleware, authenticateToken } from "../middleware/middleware";

const postsRouter = Router();

//get all posts
postsRouter.get("/",getAllPosts);

//get single post
postsRouter.get("/:postId",getPostById);

//create post
postsRouter.post("/", authenticateToken, adminAuthorizationMiddleware, createPost);

//delete post
postsRouter.delete("/:postId", authenticateToken,adminAuthorizationMiddleware,deletePostById);

//update post (publish, unpublish) and like
postsRouter.patch("/:postId", authenticateToken,updatePostById);

//commenting
postsRouter.post("/:postId", authenticateToken, createComment);

//delete comment
postsRouter.delete(
  "/:postId/:commentId",
  authenticateToken,
deleteCommentByPostIdAndCommentId
);

//like/unlike comment
postsRouter.patch(
  "/:postId/:commentId",
  authenticateToken,
  toggleLikeByPostIdAndCommentId
);

export default postsRouter;