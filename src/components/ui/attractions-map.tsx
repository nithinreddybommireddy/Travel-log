import { motion } from "framer-motion";
import { MapPin, Navigation } from "lucide-react";

interface Pin {
  name: string;
  lat: number;
  lng: number;
}

interface AttractionsMapProps {
  pins: Pin[];
  centerLat: number;
  centerLng: number;
  destinationName: string;
}

export function AttractionsMap({ pins, centerLat, centerLng, destinationName }: AttractionsMapProps) {
  const firstPin = pins[0];
  const lastPin = pins[pins.length - 1];

  if (pins.length === 0) return null;

  // Build a directions URL with all pins as waypoints for multi-marker display
  const waypoints = pins.slice(1, -1)
    .map((p) => `${p.lat},${p.lng}`)
    .join("|");

  const directionsUrl = pins.length >= 2
    ? `https://www.google.com/maps/embed/v1/directions?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&origin=${firstPin.lat},${firstPin.lng}&destination=${lastPin.lat},${lastPin.lng}${waypoints ? `&waypoints=${waypoints}` : ""}&maptype=satellite`
    : `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${firstPin.lat},${firstPin.lng}&center=${centerLat},${centerLng}&zoom=13&maptype=satellite`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="rounded-2xl overflow-hidden border border-border-light bg-surface-lighter/20"
    >
      <div className="p-4 sm:p-6 border-b border-border-light">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
            <MapPin className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Popular Attractions in {destinationName}</h3>
            <p className="text-xs text-text-muted">{pins.length} must-visit spots</p>
          </div>
        </div>
        {/* Pin Legend */}
        <div className="flex flex-wrap gap-2">
          {pins.map((pin, i) => (
            <span key={pin.name}
              className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full bg-surface-lighter/50 border border-border-light text-text-muted">
              <span className="w-2 h-2 rounded-full bg-accent" />
              {i + 1}. {pin.name}
            </span>
          ))}
        </div>
      </div>
      <div className="relative w-full" style={{ paddingBottom: "45%" }}>
        <iframe
          title={`Attractions map of ${destinationName}`}
          width="100%"
          height="100%"
          src={directionsUrl}
          className="absolute inset-0"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      {pins.length >= 2 && (
        <div className="p-3 border-t border-border-light bg-surface-lighter/10">
          <div className="flex items-center gap-2 text-[11px] text-text-muted">
            <Navigation className="w-3 h-3" />
            Route shown between {pins.length} attractions
          </div>
        </div>
      )}
    </motion.div>
  );
}

export function getDirectionsUrl(lat: number, lng: number, _name: string): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;
}

export function getPinLabel(index: number): string {
  return `${index + 1}.`;
}
