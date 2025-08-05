import { Button } from "@monorepotopblogapi/ui";
import { Sun, Moon, LogOut, User, type LucideIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { Link } from "react-router-dom";

const iconClasses = "size-10";

type NavLink =
  | { name: string; path: `/${string}` }
  | { icon: LucideIcon; path: `/${string}` };

const links: NavLink[] = [
  { name: "Blogs", path: "/Blogs" },
  { name: "Home", path: "/" },
  { name: "Login", path: "/login" },
  { name: "Sign Up", path: "/signup" },
  { icon: LogOut, path: "/logout" },
  { icon: User, path: "/user/:userId" },
];

function Header() {
  const { theme, setTheme } = useTheme();


  function toggleTheme() {
    setTheme((pre) => (pre === "dark" ? "light" : "dark"));
  }

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
        <Button
          size="icon"
          onClick={toggleTheme}
          aria-label="Change Screen Mode to Dark or Light"
          className="shadow-none w-auto h-auto"
        >
          {theme === "dark" ? (
            <Moon className={iconClasses} />
          ) : (
            <Sun className={iconClasses} />
          )}
        </Button>
      </div>
    </header>
  );
}

export default Header;