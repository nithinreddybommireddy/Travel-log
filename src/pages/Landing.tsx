import { Hero } from "@/components/landing/Hero";
import { PopularTours } from "@/components/landing/PopularTours";
import { Stories } from "@/components/landing/Stories";
import { Contact } from "@/components/landing/Contact";

export function LandingPage() {
  return (
    <main>
      <Hero />
      <PopularTours />
      <Stories />
      <Contact />
    </main>
  );
}
