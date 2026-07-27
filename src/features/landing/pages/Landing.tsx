import { Hero } from "@/features/landing/components/Hero";
import { PopularTours } from "@/features/landing/components/PopularTours";
import { About } from "@/features/landing/components/About";
import { Stories } from "@/features/landing/components/Stories";
import { Contact } from "@/features/landing/components/Contact";

export function LandingPage() {
  return (
    <main>
      <Hero />
      <PopularTours />
      <About />
      <Stories />
      <Contact />
    </main>
  );
}
