import { Router } from "express";
import { createPost, deleteCommentByPostIdAndCommentId, deletePostById, getAllPosts, getPostById, toggleLikeByPostIdAndCommentId, updatePostById } from "../controller/postsController";
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
postsRouter.delete("/:postId", authenticateToken,deletePostById);

//update post (publish, unpublish) and like
postsRouter.patch("/:postId", authenticateToken,updatePostById);

//commenting
postsRouter.post("/:postId", authenticateToken,);

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
