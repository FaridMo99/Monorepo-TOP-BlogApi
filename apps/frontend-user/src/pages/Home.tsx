import Me from "@/components/home/Me";
import PreviewSection from "@/components/home/PreviewSection";

function Home() {
  return (
    <>
      <Me />
      <PreviewSection title="Latest Posts:" queryString="?sort=desc&limit=3" />
    </>
  );
}

export default Home;
