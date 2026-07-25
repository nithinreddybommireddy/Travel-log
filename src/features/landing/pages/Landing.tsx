import { Hero } from "@/features/landing/components/Hero";
import { PopularTours } from "@/features/landing/components/PopularTours";
import { Stories } from "@/features/landing/components/Stories";
import { Contact } from "@/features/landing/components/Contact";

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
