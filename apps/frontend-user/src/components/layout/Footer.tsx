import {FaGithub} from "react-icons/fa"
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="w-screen h-[12vh] bg-primary text-primary-foreground flex flex-col justify-evenly items-center">
      <Link to="https://github.com/FaridMo99/Monorepo-TOP-BlogApi">
        <FaGithub size={40} />
      </Link>
      <p className="dark:text-white">Disclaimer: The text content on this page was generated with AI</p>
    </footer>
  );
}

export default Footer