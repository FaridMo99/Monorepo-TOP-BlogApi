import ThemeToggle from "@monorepotopblogapi/ui/components/ThemeToggle";
import { ChartColumnBig, BookOpenText,PenLine, LogOut } from "lucide-react";
import { NavLink } from "react-router-dom";

    const links = [
      { name: "Dashboard", path: "/", icon: <ChartColumnBig /> },
      { name: "View Posts", path: "/posts", icon: <BookOpenText /> },
      { name: "New Post", path: "/newPost", icon: <PenLine /> },
    ];


function Aside() {

    return (
      <aside className="sticky top-0 left-0 bg-primary lg:w-[12vw] md:w-[15vw] w-[20vw] h-screen z-10">
        <div className="flex justify-center items-center w-full h-[10vh]">
          <ThemeToggle />
        </div>
        <nav className="w-full h-1/2 mt-20 text-primary-foreground dark:text-white flex flex-col justify-evenly items-center">
          {links.map((link) => (
            <NavLink
              title={link.name}
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `p-4 ${
                  isActive ? "bg-primary-foreground/20" : ""
                } rounded-sm flex items-center
                hover:bg-primary-foreground/20`
              }
            >
              {link.icon}
            </NavLink>
          ))}
          <LogOut className="rounded-sm absolute bottom-6 hover:text-primary-foreground"/>
        </nav>
      </aside>
    );
}

export default Aside;
//add onclick that opens modal and asks are you sure? same for users route