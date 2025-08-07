import { useQuery,useMutation } from "@tanstack/react-query"
import { getPosts } from "@monorepotopblogapi/utils"
import {
  TableShadCn,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Button,
  Toaster,
  Trash
} from "@monorepotopblogapi/ui";
import {toast} from "sonner"
import { Eye, EyeOff } from "@monorepotopblogapi/ui";
import { Link } from "react-router-dom";
import { useState } from "react";

function togglePublish(postId) {
  
}

function deletePost(postId) {
  
}

function Posts() {
  const [sort, setSort] = useState<string>("?sort=desc")

  const { data: posts, isError, isLoading,error } = useQuery({
    queryKey: ["all posts"],
    queryFn: getPosts
  })

  const { data, isPending, mutate:toggleMutation } = useMutation({
    mutationKey: ["publish/unpublish post", post.isPublic],
    mutationFn: postId => togglePublish(postId),
    onSuccess: (data) => {
      toast.success(`Post ${data.title} was successfully ${data.isPublic ? "Published" : "Unpublished"}`)
    },
    onError: () => {
            toast.error(
              "Something went wrong, try again"
            );
    }
  })

    const {
      data:deleteData,
      isPending:deleteIsPending,
      mutate: deleteMutation,
    } = useMutation({
      mutationKey: ["publish/delete post", post.id],
      mutationFn: (postId) => deletePost(postId),
      onSuccess: (data) => {
        toast.success(
          `Post ${data.title} was successfully deleted`
        );
      },
      onError: () => {
        toast.error("Something went wrong, try again");
      },
    });

  return (
    <section>
      <div className="w-full flex justify-end items-center">
        <Select value={sort} onValueChange={(val) => setSort(val)}>
          <SelectTrigger>
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="?sort=asc">Date↑</SelectItem>
            <SelectItem value="?sort=desc">Date↓</SelectItem>
            <SelectItem value="?sort=asc">Likes↑</SelectItem>
            <SelectItem value="?sort=desc">Likes↓</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <TableShadCn className="bg-primary text-primary-foreground dark:text-white mt-10  rounded-xs border">
        <TableCaption>All your Blog Posts</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Title</TableHead>
            <TableHead>Preview</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-center">Public</TableHead>
            <TableHead className="text-center">Delete</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <Link className="w-auto h-auto" to={`/posts/${post.id}`}>
              <TableCell className="font-medium truncate max-w-[20vw]">
                {post.title}
              </TableCell>
            </Link>
            <TableCell className="truncate max-w-[15vw]">{post.text}</TableCell>
            <TableCell>{post.createdAt}</TableCell>
            <TableCell className="flex justify-center items-center">
              <Button
                onClick={() => toggleMutation(post.id)}
                size="icon"
                className="w-auto h-auto align-middle"
              >
                {post.isPublic ? (
                  <Eye className="size-5 text-white" />
                ) : (
                  <EyeOff className="text-gray-400 size-5" />
                )}
              </Button>
            </TableCell>
            <TableCell>
              <Button
                onClick={() => deleteMutation(post.id)}
                size="icon"
                className="w-auto h-auto flex justify-center"
              >
                <Trash className="size-5 text-red-500" />
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </TableShadCn>
      <Toaster richColors />
    </section>
  );
}

export default Posts
//here you can delete remove x-scroll

const post = {
  id: "Postid for link",
  title:
    "Why You Should Learn the Fundamentals Before Chasing the Latest JavaScript Framework",
  text: `In the fast-moving world of web development, it’s tempting to jump 
  straight into the latest frameworks like React, Vue, or Svelte.But without
  a solid understanding of HTML, CSS, and vanilla JavaScript, you’ll often
  find yourself stuck, frustrated, or relying on copy- paste solutions.
  Learning the fundamentals helps you understand why things work, not just
  how to make them work.It gives you the power to debug, optimize, and build
  things from scratch without depending too heavily on abstractions.Frameworks
   are tools, not crutches.Once you master the core concepts — like the DOM,
   event handling, scope, and layout — you’ll be able to pick up any new
   technology much faster and build more reliable, maintainable applications.
   Don’t skip the foundation.The web is built on it.`,
  layout: "STANDARD",
  createdAt: new Date().toLocaleDateString(),
  isPublic: true,
  likes: [1, 2, 3, 4, 5],
  comments: [1, 2, 3, 4, 5],
};