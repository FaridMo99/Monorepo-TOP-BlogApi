import { TriangleAlert } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

function Error() {
    const navigate = useNavigate()
  return (
   <main className="text-primary bg-primary-foreground w-screen h-screen flex flex-col justify-center items-center dark:text-white">
  <TriangleAlert className="animate-pulse" size={120} />
  <p className="font-bold text-2xl text-primary my-10 dark:text-white">
    Oops.Something went wrong...
  </p>
  <div className="flex w-1/2 items-center justify-around">
    <Button
      className="dark:text-white"
      onClick={() => {
        navigate(-1);
      }}
    >
      Go Back
    </Button>
    <Button
      className="dark:text-white"
      onClick={() => {
        navigate("/");
      }}
    >
      Go Home
    </Button>
  </div>
</main>
  )
}

export default Error