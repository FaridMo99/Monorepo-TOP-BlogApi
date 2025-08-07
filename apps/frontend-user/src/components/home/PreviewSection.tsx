import { useQuery } from "@tanstack/react-query"
import PostCard from "../PostCard"
import { getPosts } from "@monorepotopblogapi/utils"

type PreviewSectionProps = {
  title: string,
  queryString?:string
}


function PreviewSection({title,queryString=""}:PreviewSectionProps) {
  const { data:Posts, isLoading, isError } = useQuery({
    queryKey: ["get preview Posts"],
    queryFn: () => getPosts(queryString),
    retry:false
  })

  if(isLoading) return <p>Loading...</p>

  return (
    <section className="w-full">
      <h2 className="text-3xl font-medium mb-4">{ title}</h2>
      {isLoading && <p>Loading</p>}
      {/*(isError || !Posts || Posts.length === 0) && <p>No Posts found...</p>*/}
      <div className="flex flex-col md:flex-row items-center justify-evenly gap-y-4 md:min-h-auto md:gap-x-4">
        {Posts?.map((post) => (
          <PostCard post={post} />
        ))}
        <PostCard post={postTest} />
        <PostCard post={postTest} />
        <PostCard post={postTest} />
      </div>
    </section>
  );
}

export default PreviewSection

const postTest = {
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