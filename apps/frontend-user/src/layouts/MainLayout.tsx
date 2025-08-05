import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { Loader2 } from "lucide-react";
import { Outlet } from "react-router-dom";
import { useNavigation } from "react-router-dom";

function MainLayout() {
  const { state } = useNavigation();


  return (
    <>
      <Header/>
      <main className="w-screen h-full min-h-[88vh] bg-primary-foreground px-22 py-16">
        {state === "loading" ? (
          <div className="w-full min-h-[88vh] flex justify-center items-center">
            <Loader2
              className="animate-spin text-primary w-1/8 h-1/8 mb-22"
              strokeWidth={4}
            />
          </div>
        ) : (
          <Outlet />
        )}
      </main>
      <Footer/>
    </>
  );
}

export default MainLayout;
