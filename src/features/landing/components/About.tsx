import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Compass, Users, MapPin, Award } from "lucide-react";

const stats = [
  { icon: Compass, value: "50+", label: "Destinations" },
  { icon: Users, value: "10K+", label: "Happy Travelers" },
  { icon: MapPin, value: "200+", label: "Short Trips" },
  { icon: Award, value: "4.9", label: "Avg Rating" },
];

const values = [
  {
    title: "Curated Experiences",
    description:
      "Every destination is hand-picked and vetted by our team of expert travelers to ensure authentic, unforgettable experiences.",
  },
  {
    title: "Sustainable Travel",
    description:
      "We partner with eco-conscious local businesses and promote responsible tourism that respects nature and local communities.",
  },
  {
    title: "24/7 Support",
    description:
      "From planning to return, our travel experts are available around the clock to assist you at every step of your journey.",
  },
];

export function About() {
  return (
    <section id="about" className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-surface via-surface-light/30 to-surface" />
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 30%, var(--color-primary) 0%, transparent 40%), radial-gradient(circle at 80% 70%, var(--color-accent) 0%, transparent 40%)`,
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge variant="default" className="mb-4">About Us</Badge>
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Your Journey,{" "}
            <span className="text-gradient">Our Passion</span>
          </h2>
          <p className="text-text-secondary max-w-3xl mx-auto text-lg leading-relaxed">
            TravelLog was born from a simple idea — that every journey should be extraordinary.
            We're a team of passionate explorers dedicated to crafting travel experiences that
            go beyond the ordinary, connecting you with the heart and soul of every destination.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="relative bg-surface-light/30 backdrop-blur-sm rounded-2xl border border-border-light p-6 text-center group hover:border-accent/20 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-6 h-6 text-accent" />
                </div>
                <div className="text-3xl font-bold text-gradient mb-1">{stat.value}</div>
                <div className="text-sm text-text-secondary">{stat.label}</div>
              </motion.div>
            );
          })}
        </div>

        {/* Values */}
        <div className="grid md:grid-cols-3 gap-6">
          {values.map((value, i) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="relative bg-surface-light/20 backdrop-blur-sm rounded-2xl border border-border-light p-8 hover:border-primary/20 transition-all duration-500 hover:shadow-xl hover:shadow-primary/5"
            >
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-5">
                <div className="w-3 h-3 rounded-full bg-accent" />
              </div>
              <h3 className="text-lg font-semibold mb-3">{value.title}</h3>
              <p className="text-text-secondary text-sm leading-relaxed">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
