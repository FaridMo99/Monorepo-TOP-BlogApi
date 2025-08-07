import {  LogOut, User, type LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import {useAuthStore} from "@monorepotopblogapi/utils"
import ThemeToggle from "@monorepotopblogapi/ui/components/ThemeToggle";
type NavLink =
  | { name: string; path: `/${string}` }
  | { icon: LucideIcon; path: `/${string}` };


function Header() {
  const { user } = useAuthStore()
  
  const links: NavLink[] = [
    { name: "Blogs", path: "/Blogs" },
    { name: "Home", path: "/" },
    !user ? { name: "Login", path: "/login" }:{ icon: User, path: "/user/:userId" },
    !user ? { name: "Sign Up", path: "/signup" }:{ icon: LogOut, path: "/logout" },
  ];

  


  return (
    <header className="w-screen h-[12vh] bg-primary text-primary-foreground flex justify-between items-center">
      <nav className="w-1/2 flex justify-evenly items-center">
        {links.map(link => (
          <Link
            key={link.path}
            className="hover:underline underline-offset-4 dark:text-white"
            to={link.path}
          >
            {"icon" in link ? <link.icon className="w-5 h-5" /> : link.name}
          </Link>
        ))}
      </nav>
      <div className="w-1/6 h-full flex justify-center items-center">
        <ThemeToggle/>
      </div>
    </header>
  );
}

export default Header;