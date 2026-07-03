import Header from "@/components/Header";
import Playground from "@/components/Playground";

const PlaygroundPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Playground mode="fullpage" />
    </div>
  );
};

export default PlaygroundPage;
