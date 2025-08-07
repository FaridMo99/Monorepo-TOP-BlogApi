import Layout from "@/layouts/Layout"
import Dashboard from "@/pages/Dashboard"
import NewPost from "@/pages/NewPost"
import Post from "@/pages/Post"
import Posts from "@/pages/Posts"
import { createBrowserRouter, redirect } from "react-router-dom"
import { useAuthStore } from "@monorepotopblogapi/utils"
import Login from "@/pages/Login"
import Error from "@monorepotopblogapi/ui/components/Error"

const loaderRedirect = () => {
    if (useAuthStore.getState().isAuthenticated) {
        return redirect("/")
    }
    return redirect("/login")
}

const router = createBrowserRouter([
    {
        path: "/",
        //loader:loaderRedirect,
        errorElement:<Error/>,
        element:<Layout/>,
        children: [
            {
            element: <Dashboard />,
            index:true
            },
            {
                element: <NewPost />,
                path:"newPost"
            },
            {
                element: <Posts />,
                path: "posts",
                children:[{element:<Post/>,path:":postId"}]
            }
        ]
    },
    {
        element: <Login />,
        path:"/login"
    }
])


export default router