import MainLayout from "@/layouts/MainLayout";
import { privateAuthCheck, publicAuthCheck } from "@/lib/authChecks";
import Blogpost from "@/pages/Blogpost";
import Blogs from "@/pages/Blogs";
import Error from "@monorepotopblogapi/ui/components/Error";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import User from "@/pages/User";
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <Error />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            element: <Home />,
            index: true,
          },
          {
            element: <User />,
            path: "user/:userId",
            loader: privateAuthCheck,
          },
          {
            element: <Blogs />,
            path: "blogs",
          },
          {
            element: <Blogpost />,
            path: "blogs/:postId",
          },
        ],
      },
      {
        children: [
          {
            element: <Login />,
            path: "login",
            loader: publicAuthCheck,
          },
          {
            element: <Signup />,
            path: "signup",
            loader: publicAuthCheck,
          },
        ],
      },
    ],
  },
]);

export default router;
