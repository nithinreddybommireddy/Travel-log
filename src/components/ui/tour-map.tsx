import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

interface TourMapProps {
  lat: number;
  lng: number;
  name: string;
  location: string;
}

export function TourMap({ lat, lng, name, location }: TourMapProps) {
  const embedUrl = `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${lat},${lng}&center=${lat},${lng}&zoom=12&maptype=satellite`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="rounded-2xl overflow-hidden border border-border-light bg-surface-lighter/20"
    >
      <div className="p-4 sm:p-6 border-b border-border-light">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
            <MapPin className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">{name}</h3>
            <p className="text-xs text-text-muted">{location}</p>
          </div>
        </div>
      </div>
      <div className="relative w-full" style={{ paddingBottom: "45%" }}>
        <iframe
          title={`Map of ${name}`}
          width="100%"
          height="100%"
          src={embedUrl}
          className="absolute inset-0"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </motion.div>
  );
}
