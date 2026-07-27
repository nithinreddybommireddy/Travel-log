import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const stories = [
  {
    name: "Priya Sharma",
    location: "Mumbai, India",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
    text: "The Manali trip was absolutely breathtaking! The guided treks through pine forests and camping under the Himalayan stars was an experience I'll cherish forever. Every detail was perfectly arranged.",
    rating: 5,
    tour: "Manali Adventure",
  },
  {
    name: "Arjun Patel",
    location: "Delhi, India",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
    text: "Goa with TravelLog was pure magic! From the sunset cruises to the water sports, everything was top-notch. The team made sure we experienced the best of Goan culture and cuisine.",
    rating: 5,
    tour: "Goa Beach Escape",
  },
  {
    name: "Ananya Reddy",
    location: "Bangalore, India",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
    text: "The Munnar tea plantation tour was a dream come true. Walking through endless green tea gardens, visiting spice plantations, and the Ayurvedic spa - pure bliss!",
    rating: 5,
    tour: "Munnar Tea Trails",
  },
  {
    name: "Rahul Verma",
    location: "Pune, India",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80",
    text: "Kedarnath pilgrimage with TravelLog was both spiritually fulfilling and well-organized. The trek was challenging but the guides were incredibly supportive. Highly recommended!",
    rating: 5,
    tour: "Kedarnath Pilgrimage",
  },
];

export function Stories() {
  return (
    <section id="stories" className="relative py-24 overflow-hidden">
      {/* Background Video Effect */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-surface to-surface-light" />
        <div className="absolute inset-0 opacity-[0.05] dark:opacity-[0.08]">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `radial-gradient(circle at 25% 50%, color-mix(in oklab, var(--color-primary) 25%, transparent) 0%, transparent 50%), radial-gradient(circle at 75% 50%, color-mix(in oklab, var(--color-accent) 25%, transparent) 0%, transparent 50%)`,
            }}
          />
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge variant="default" className="mb-4">Stories</Badge>
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            What Our{" "}
            <span className="text-gradient">Travelers</span> Say
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Real experiences from real travelers. Discover why thousands choose
            TravelLog for their adventures.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {stories.map((story, index) => (
            <motion.div
              key={story.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group"
            >
              <div className="relative bg-surface-light/40 backdrop-blur-sm rounded-2xl border border-border-light p-6 hover:border-accent/20 transition-all duration-500 hover:shadow-xl hover:shadow-accent/5">
                {/* Quote Icon */}
                <Quote className="w-8 h-8 text-accent/30 mb-4" />

                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: story.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-accent fill-accent"
                    />
                  ))}
                </div>

                {/* Text */}
                <p className="text-text-secondary leading-relaxed mb-6 italic">
                  &ldquo;{story.text}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <img
                    src={story.image}
                    alt={story.name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-border-light"
                  />
                  <div>
                    <div className="font-semibold text-sm">{story.name}</div>
                    <div className="text-xs text-text-muted">{story.tour}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
