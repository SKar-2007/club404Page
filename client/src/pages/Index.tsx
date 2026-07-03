import Header from "@/components/Header";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Events from "@/components/Events";
import Team from "@/components/Team";
import Playground from "@/components/Playground";
import HallOfFame from "@/components/HallOfFame";
import AdminPanel from "@/components/AdminPanel";
import Contact from "@/components/Contact";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <About />
      <Services />
      <Events />
      <Team />
      <Playground />
      <HallOfFame />
      <AdminPanel />
      <Contact />
    </div>
  );
};

export default Index;
