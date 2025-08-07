import { Button } from './ui/button';
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react"

const iconClasses = "size-10";

function ThemeToggle() {
    const { theme, setTheme } = useTheme();

    function toggleTheme() {
      setTheme((pre) => (pre === "dark" ? "light" : "dark"));
    }

  return (
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
  );
}

export default ThemeToggle