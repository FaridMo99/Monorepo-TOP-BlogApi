import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@monorepotopblogapi/ui"
import { Link } from "react-router-dom"
import {Heart, MessageCircle} from "lucide-react"



function PostCard({post}) {
    return (
      <Link to={`/Blogs/${post.id}`}>
        <Card className="bg-primary text-primary-foreground relative dark:text-white hover:border-amber-400 hover:dark:border-pink-400 transition-all duration-500 hover:-translate-y-2">
          <CardHeader>
            <CardTitle>{post.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{post.text.slice(0, 100) + "..."}</p>
          </CardContent>
          <CardFooter className="flex justify-center items-center">
            <div className="flex justify-evenly w-1/2">
              <div className="flex">
                <Heart />
                <span className="ml-1">{post.likes.length}</span>
              </div>
              <div className="flex">
                <MessageCircle />
                <span className="ml-1">{post.comments.length}</span>
              </div>
            </div>
            <p className="absolute bottom-2 right-4 brightness-50 text-xs">
              {post.createdAt}
            </p>
          </CardFooter>
        </Card>
      </Link>
    );
}

export default PostCard
//add like logic, heart should be filled and red if already liked,
//like should be post request and etc.