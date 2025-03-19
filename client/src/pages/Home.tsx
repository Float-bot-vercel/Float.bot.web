import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Commands from "@/components/Commands";
import Games from "@/components/Games";
import FAQ from "@/components/FAQ";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Hero />
      <Features />
      <Commands />
      <Games />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  );
}
