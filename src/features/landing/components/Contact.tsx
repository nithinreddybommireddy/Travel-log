import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Mail, Phone, MapPin, CheckCircle2, Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { sendContactEmail, subscribeNewsletter } from "@/services/emailService";

export function Contact() {
  const { showToast } = useToast();

  // Contact form state
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactMessage, setContactMessage] = useState("");

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactEmail.trim()) {
      showToast("Please fill in your name and email", "info");
      return;
    }
    sendContactEmail(contactName, contactEmail, contactPhone, contactMessage);
    showToast("Message opened in your email client! ✉️", "success");
    setContactName("");
    setContactEmail("");
    setContactPhone("");
    setContactMessage("");
  };

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim() || !newsletterEmail.includes("@")) {
      showToast("Please enter a valid email address", "info");
      return;
    }
    const result = subscribeNewsletter(newsletterEmail);
    if (result.success) {
      setSubscribed(true);
      setNewsletterEmail("");
    }
    showToast(result.message, result.success ? "success" : "info");
  };

  return (
    <section id="contact" className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-surface to-surface-light" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge variant="accent" className="mb-4">Get In Touch</Badge>
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Let's Plan Your{" "}
            <span className="text-gradient">Next Trip</span>
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Have a question or need help planning your perfect adventure?
            We'd love to hear from you.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left - Contact Info + Newsletter */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="space-y-6">
              {[
                {
                  icon: Mail,
                  label: "Email",
                  value: "hello@travellog.com",
                  desc: "We'll respond within 24 hours",
                },
                {
                  icon: Phone,
                  label: "Phone",
                  value: "+91 1800-TRAVEL",
                  desc: "Mon-Fri from 9AM to 6PM IST",
                },
                {
                  icon: MapPin,
                  label: "Office",
                  value: "Mumbai, Maharashtra, India",
                  desc: "Visit us by appointment",
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-accent/10 border border-accent/20">
                      <Icon className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <div className="font-semibold mb-1">{item.label}</div>
                      <div className="text-text-secondary">{item.value}</div>
                      <div className="text-xs text-text-muted mt-0.5">{item.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Newsletter Subscription */}
            <div className="bg-accent/5 border border-accent/20 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <Bell className="w-5 h-5 text-accent" />
                <div>
                  <h3 className="font-semibold text-sm">Stay Updated</h3>
                  <p className="text-xs text-text-muted">Get exclusive deals & travel inspiration</p>
                </div>
              </div>
              {subscribed ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-green-500/10 border border-green-500/20"
                >
                  <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                  <div>
                    <div className="text-sm font-medium text-green-400">Subscribed! 🎉</div>
                    <div className="text-xs text-text-muted">Welcome to the Travel Log community</div>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleNewsletter} className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" variant="secondary" className="gap-2 shrink-0">
                    <Send className="w-4 h-4" />
                    Subscribe
                  </Button>
                </form>
              )}
            </div>
          </motion.div>

          {/* Right - Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <form
              onSubmit={handleContactSubmit}
              className="bg-surface-light/40 backdrop-blur-sm rounded-2xl border border-border-light p-8 space-y-5"
            >
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-secondary">
                    Full Name *
                  </label>
                  <Input
                    placeholder="Enter your name"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-secondary">
                    Email *
                  </label>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary">
                  Phone
                </label>
                <Input
                  type="tel"
                  placeholder="Enter your phone number"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary">
                  Message
                </label>
                <textarea
                  className="flex min-h-[120px] w-full rounded-lg border border-border-light bg-surface-lighter/50 px-4 py-3 text-sm text-text-primary placeholder:text-text-muted transition-all duration-200 focus-visible:outline-none focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary/20 hover:border-border-light/80 resize-none"
                  placeholder="Tell us about your dream trip..."
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                />
              </div>
              <Button type="submit" size="lg" className="w-full gap-2 group">
                <Send className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                Send Message
              </Button>
              <p className="text-[10px] text-text-muted text-center">
                Your message will be sent via email. We'll get back to you within 24 hours.
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
