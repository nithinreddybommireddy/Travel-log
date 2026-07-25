export type TourCategory = "hill-station" | "beach" | "pilgrimage" | "adventure" | "cultural" | "wildlife" | "romantic";

export interface Tour {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  longDescription: string;
  image: string;
  images: string[];
  price: number;
  duration: string;
  maxPeople: number;
  tourGuides: number;
  accommodation: string;
  difficulty: "easy" | "medium" | "hard";
  category: TourCategory;
  highlights: string[];
  itinerary: { day: string; description: string }[];
  location: string;
  rating: number;
  reviews: number;
  color: string;
  bestSeason: string;
  coordinates: { lat: number; lng: number };
  nearestAirport: string;
  languages: string[];
  currency: string;
  timeZone: string;
  knownFor: string[];
  altitude?: string;
  areaKm2?: string;
  population?: string;
}

export const categories: { id: TourCategory; label: string; color: string }[] = [
  { id: "hill-station", label: "Hill Station", color: "#3b82f6" },
  { id: "beach", label: "Beach", color: "#06b6d4" },
  { id: "pilgrimage", label: "Pilgrimage", color: "#f59e0b" },
  { id: "adventure", label: "Adventure", color: "#ef4444" },
  { id: "cultural", label: "Cultural", color: "#8b5cf6" },
  { id: "wildlife", label: "Wildlife", color: "#22c55e" },
  { id: "romantic", label: "Romantic", color: "#ec4899" },
];

export const tours: Tour[] = [
  // ---- India Destinations ----
  {
    id: "manali",
    name: "Manali",
    subtitle: "The Valley of Gods",
    description: "Nestled in the Himalayas, Manali offers breathtaking mountain views, pine forests, and adventure sports.",
    longDescription: "Manali is a high-altitude Himalayan resort town in India's Himachal Pradesh, with pine forests, rushing rivers, and snow-capped peaks. This 7-day journey takes you through ancient temples, apple orchards, and the famous Rohtang Pass at 3,978m. Experience the magic of the mountains with guided treks, river rafting in the Beas River, and serene camping under star-lit skies. The local Tibetan influence adds a unique cultural flavor to this mountain paradise.",
    image: "https://images.unsplash.com/photo-1582653291997-079a1c04e5a1?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1582653291997-079a1c04e5a1?w=800&q=80",
      "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
    ],
    price: 12000, duration: "7 days", maxPeople: 20, tourGuides: 4,
    accommodation: "Private Tents & Resort", difficulty: "medium", category: "hill-station",
    highlights: ["Rohtang Pass expedition at 3,978m", "Solang Valley paragliding", "Hadimba Temple (16th century)", "River rafting in Beas River", "Camping under Himalayan stars", "Tibetan monastery visit"],
    itinerary: [
      { day: "Day 1", description: "Arrive in Manali, acclimatize and evening walk through Mall Road" },
      { day: "Day 2", description: "Visit Hadimba Temple, Manu Temple, and Old Manali" },
      { day: "Day 3", description: "Solang Valley - paragliding, zorbing, and ropeway" },
      { day: "Day 4", description: "Rohtang Pass day trip - snow sports and scenic views" },
      { day: "Day 5", description: "River rafting in Beas River + camping setup" },
      { day: "Day 6", description: "Trek to Jogini Falls and explore Vashisht hot springs" },
      { day: "Day 7", description: "Departure after breakfast with lifetime memories" },
    ],
    location: "Himachal Pradesh, India", rating: 4.8, reviews: 342, color: "#3b82f6", bestSeason: "March-June",
    coordinates: { lat: 32.2432, lng: 77.1892 },
    nearestAirport: "Kullu–Manali Airport (27 km)",
    languages: ["Hindi", "English", "Pahari"],
    currency: "Indian Rupee (₹)", timeZone: "IST (UTC+5:30)",
    knownFor: ["Himalayan treks", "Rohtang Pass", "Solang Valley", "Apples & Trout fishing"],
    altitude: "2,050 m", areaKm2: "3,150 km²", population: "32,000",
  },
  {
    id: "goa",
    name: "Goa",
    subtitle: "Sun, Sand & Serenity",
    description: "Famous for its stunning beaches, vibrant nightlife, Portuguese architecture, and delicious seafood.",
    longDescription: "Goa is India's ultimate beach paradise, with 103 km of coastline along the Arabian Sea. From the golden sands of Baga to the serene shores of Palolem, this 6-day journey offers the perfect blend of relaxation and adventure. Explore colonial Portuguese architecture with its 400-year-old churches, indulge in water sports, savor fresh seafood at beach shacks, and experience the legendary Goan nightlife. The blend of Indian and Portuguese cultures creates a unique, laid-back vibe.",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80",
      "https://images.unsplash.com/photo-1540202404-a2f29016b523?w=800&q=80",
      "https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&q=80",
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80",
    ],
    price: 8999, duration: "6 days", maxPeople: 30, tourGuides: 5,
    accommodation: "Beach Resort", difficulty: "easy", category: "beach",
    highlights: ["103 km of pristine coastline", "Water sports - parasailing, jet skiing", "Portuguese architecture tour (16th century)", "Sunset cruise on Mandovi River", "Goan seafood feast & nightlife", "Spice plantation tour"],
    itinerary: [
      { day: "Day 1", description: "Arrive in Goa, check into beach resort, sunset at Baga" },
      { day: "Day 2", description: "North Goa tour - Anjuna flea market, Vagator beach" },
      { day: "Day 3", description: "Water sports day - parasailing, banana ride, jet skiing" },
      { day: "Day 4", description: "South Goa exploration - Palolem, butterfly beach" },
      { day: "Day 5", description: "Old Goa churches, spice plantation tour + sunset cruise" },
      { day: "Day 6", description: "Departure with Goan souvenirs and memories" },
    ],
    location: "Goa, India", rating: 4.7, reviews: 521, color: "#10b981", bestSeason: "November-February",
    coordinates: { lat: 15.4909, lng: 73.8278 },
    nearestAirport: "Goa International Airport (Dabolim, 12 km)",
    languages: ["Konkani", "English", "Hindi", "Marathi"],
    currency: "Indian Rupee (₹)", timeZone: "IST (UTC+5:30)",
    knownFor: ["Beach shacks & seafood", "Portuguese churches", "Nightlife & music festivals", "Cashew feni"],
    altitude: "Sea level", areaKm2: "3,702 km²", population: "1.5 million",
  },
  {
    id: "munnar",
    name: "Munnar",
    subtitle: "The Tea Garden Paradise",
    description: "Rolling tea plantations, misty hills, and cool climate make Munnar a perfect hill station getaway.",
    longDescription: "Munnar is a picturesque hill station in Kerala's Western Ghats, sitting at 1,600m above sea level. Known for its sprawling tea plantations — some dating back to 1877 — exotic wildlife, and breathtaking viewpoints, this 7-day journey offers a perfect escape into nature's lap. Trek through lush green valleys, visit Eravikulam National Park (home to the endangered Nilgiri Tahr), and experience the tranquility of the mountains. Munnar produces some of India's finest tea.",
    image: "https://images.unsplash.com/photo-1597225244664-8a6e1f1e5b1e?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1597225244664-8a6e1f1e5b1e?w=800&q=80",
      "https://images.unsplash.com/photo-1559650656-5d1d361ad10e?w=800&q=80",
      "https://images.unsplash.com/photo-1580136579312-94651dfd596d?w=800&q=80",
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80",
    ],
    price: 9999, duration: "7 days", maxPeople: 20, tourGuides: 8,
    accommodation: "Tea Estate Resort", difficulty: "easy", category: "hill-station",
    highlights: ["Tea plantation tour since 1877", "Eravikulam National Park safari", "Mattupetty Dam boating", "Top Station viewpoint trek (1,700m)", "Spice garden exploration", "Nilgiri Tahr spotting"],
    itinerary: [
      { day: "Day 1", description: "Arrive in Munnar, check into hill resort" },
      { day: "Day 2", description: "Tea plantation tour - learn tea processing & tasting" },
      { day: "Day 3", description: "Eravikulam National Park - Nilgiri Tahr spotting" },
      { day: "Day 4", description: "Mattupetty Dam, Echo Point, and Kundala Lake" },
      { day: "Day 5", description: "Top Station trek - panoramic views of Western Ghats" },
      { day: "Day 6", description: "Spice garden tour and Ayurvedic spa evening" },
      { day: "Day 7", description: "Departure with fresh tea and spices" },
    ],
    location: "Kerala, India", rating: 4.6, reviews: 289, color: "#22c55e", bestSeason: "September-March",
    coordinates: { lat: 10.0889, lng: 77.0595 },
    nearestAirport: "Cochin International Airport (110 km)",
    languages: ["Malayalam", "English", "Tamil"],
    currency: "Indian Rupee (₹)", timeZone: "IST (UTC+5:30)",
    knownFor: ["Tea plantations", "Eravikulam National Park", "Spice gardens", "Ayurvedic treatments"],
    altitude: "1,600 m", areaKm2: "557 km²", population: "68,000",
  },
  {
    id: "araku",
    name: "Araku Valley",
    subtitle: "Hidden Gem of the East",
    description: "A pristine valley in the Eastern Ghats known for coffee plantations, waterfalls, and tribal culture.",
    longDescription: "Araku Valley is a tranquil hill station in Andhra Pradesh at 920m elevation, surrounded by lush green forests, coffee plantations, and stunning waterfalls. This 5-day journey offers a perfect blend of nature, culture, and adventure. Explore the fascinating tribal museum showcasing 75 local tribes, visit coffee plantations producing award-winning Arabica beans, trek to the magnificent Chaparu waterfall, and experience the rich tribal heritage of the Eastern Ghats.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
      "https://images.unsplash.com/photo-1470071459604-a3a0d0f0a0c9?w=800&q=80",
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80",
    ],
    price: 5999, duration: "5 days", maxPeople: 20, tourGuides: 4,
    accommodation: "Eco Tents", difficulty: "easy", category: "adventure",
    highlights: ["Coffee plantation tour (Arabica beans)", "Borra Caves - 150 million years old", "Tribal museum - 75 tribes", "Chaparu waterfall trek", "Sunset at Ananthagiri hills", "Tribal dance performance"],
    itinerary: [
      { day: "Day 1", description: "Arrive in Araku, check into tented camp" },
      { day: "Day 2", description: "Coffee plantation tour & tribal museum" },
      { day: "Day 3", description: "Borra Caves expedition and waterfall trek" },
      { day: "Day 4", description: "Ananthagiri hills trek & sunset viewpoint" },
      { day: "Day 5", description: "Departure with Araku coffee" },
    ],
    location: "Andhra Pradesh, India", rating: 4.5, reviews: 178, color: "#a855f7", bestSeason: "October-March",
    coordinates: { lat: 18.3270, lng: 82.8760 },
    nearestAirport: "Visakhapatnam International Airport (115 km)",
    languages: ["Telugu", "Hindi", "English", "Odia"],
    currency: "Indian Rupee (₹)", timeZone: "IST (UTC+5:30)",
    knownFor: ["Coffee plantations", "Borra Caves", "Tribal heritage", "Biodiversity hotspot"],
    altitude: "920 m", areaKm2: "2,236 km²", population: "17,000",
  },
  {
    id: "pondicherry",
    name: "Pondicherry",
    subtitle: "The French Riviera of India",
    description: "A charming coastal town with French colonial influence, serene beaches, and spiritual vibes.",
    longDescription: "Pondicherry, also known as Puducherry, is a unique destination that beautifully blends French colonial heritage with Tamil culture. This 7-day journey takes you through quaint French Quarter streets with 18th-century colonial architecture, serene beaches, and spiritual retreats. Experience the famous Sri Aurobindo Ashram, explore art galleries, enjoy water sports at Paradise Beach, and savor exquisite French-Indian fusion cuisine at the many cafes along the Promenade.",
    image: "https://images.unsplash.com/photo-1555126634-323283e090fa?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1555126634-323283e090fa?w=800&q=80",
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80",
      "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&q=80",
    ],
    price: 8999, duration: "7 days", maxPeople: 20, tourGuides: 4,
    accommodation: "Heritage Hotel", difficulty: "easy", category: "cultural",
    highlights: ["French Quarter heritage walk (18th century)", "Sri Aurobindo Ashram visit", "Paradise Beach & water sports", "Auroville - the experimental township", "French-Indian fusion cooking class", "Promenade sunset walk"],
    itinerary: [
      { day: "Day 1", description: "Arrive in Pondicherry, French Quarter stroll" },
      { day: "Day 2", description: "Heritage walk - colonial architecture & boutiques" },
      { day: "Day 3", description: "Auroville visit - Matrimandir meditation" },
      { day: "Day 4", description: "Paradise Beach day - water sports & relaxation" },
      { day: "Day 5", description: "Sri Aurobindo Ashram + cooking class" },
      { day: "Day 6", description: "Boat tour to nearby islands and snorkeling" },
      { day: "Day 7", description: "Departure with French-inspired memories" },
    ],
    location: "Puducherry, India", rating: 4.4, reviews: 256, color: "#f59e0b", bestSeason: "October-March",
    coordinates: { lat: 11.9416, lng: 79.8083 },
    nearestAirport: "Chennai International Airport (150 km)",
    languages: ["Tamil", "French", "English", "Telugu"],
    currency: "Indian Rupee (₹)", timeZone: "IST (UTC+5:30)",
    knownFor: ["French colonial architecture", "Sri Aurobindo Ashram", "Auroville", "Boutique cafes & bakeries"],
    altitude: "Sea level", areaKm2: "492 km²", population: "244,000",
  },
  {
    id: "kedarnath",
    name: "Kedarnath",
    subtitle: "The Sacred Himalayan Shrine",
    description: "One of the most sacred pilgrimage sites, nestled in the majestic Garhwal Himalayas at 3,583m.",
    longDescription: "Kedarnath is one of the holiest Hindu pilgrimage sites, situated in the Garhwal Himalayan range at an altitude of 3,583 meters. The temple, built in the 8th century AD by Adi Shankaracharya, is dedicated to Lord Shiva and forms part of the Char Dham Yatra. This 7-day spiritual journey takes you through breathtaking mountain landscapes, ancient temples, and pristine glaciers. The 16-km trek from Gaurikund to Kedarnath is both a physical challenge and a deeply spiritual experience.",
    image: "https://images.unsplash.com/photo-1566837945700-30057527ade0?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1566837945700-30057527ade0?w=800&q=80",
      "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
    ],
    price: 14999, duration: "7 days", maxPeople: 20, tourGuides: 8,
    accommodation: "Guest House & Camp", difficulty: "hard", category: "pilgrimage",
    highlights: ["Kedarnath Temple (8th century)", "16 km scenic trek through Himalayas", "Gaurikund thermal springs", "Vasuki Tal lake trek at 4,135m", "Panoramic Himalayan views", "Ganga Aarti at Haridwar"],
    itinerary: [
      { day: "Day 1", description: "Arrive in Haridwar, evening Ganga aarti" },
      { day: "Day 2", description: "Drive to Gaurikund, begin trek to Kedarnath" },
      { day: "Day 3", description: "Trek continues - reach Kedarnath, evening aarti" },
      { day: "Day 4", description: "Kedarnath Temple darshan and spiritual activities" },
      { day: "Day 5", description: "Vasuki Tal lake trek (optional) at 4,135m" },
      { day: "Day 6", description: "Descend trek back to Gaurikund, drive to Rudraprayag" },
      { day: "Day 7", description: "Departure from Haridwar with divine blessings" },
    ],
    location: "Uttarakhand, India", rating: 4.9, reviews: 412, color: "#ef4444", bestSeason: "May-October",
    coordinates: { lat: 30.7352, lng: 79.0670 },
    nearestAirport: "Jolly Grant Airport, Dehradun (239 km)",
    languages: ["Hindi", "Sanskrit", "Garhwali", "English"],
    currency: "Indian Rupee (₹)", timeZone: "IST (UTC+5:30)",
    knownFor: ["Kedarnath Temple", "Char Dham Yatra", "Garhwal Himalayas", "Spiritual treks"],
    altitude: "3,583 m", areaKm2: "2,954 km²", population: "1,200 (seasonal)",
  },

  {
    id: "hyderabad",
    name: "Hyderabad",
    subtitle: "City of Pearls & Nizams",
    description: "A mesmerizing blend of 400-year-old history, world-famous biryani, bustling bazaars, and India's cutting-edge tech scene.",
    longDescription: "Hyderabad, the capital of Telangana, is a city where 16th-century Charminar stands alongside futuristic IT corridors. This 5-day journey takes you through the opulent history of the Nizams at Golconda Fort, the shimmering bangles of Laad Bazaar, the serene Hussain Sagar lake, and the vibrant lanes of the Old City. Savor the world-renowned Hyderabadi biryani, explore the royal collections at the Chowmahalla Palace, and witness the spectacular light & sound show at Golconda. The city perfectly balances its royal past with a cosmopolitan present.",
    image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&q=80",
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80",
      "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&q=80",
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80",
    ],
    price: 6999, duration: "5 days", maxPeople: 25, tourGuides: 4,
    accommodation: "Heritage Hotel & Business Hotel", difficulty: "easy", category: "cultural",
    highlights: ["Charminar - iconic 1591 monument", "Golconda Fort & light & sound show", "Hyderabadi biryani at Paradise", "Hussain Sagar & Buddha statue", "Chowmahalla Palace (Nizams' palace)", "Ramoji Film City tour"],
    itinerary: [
      { day: "Day 1", description: "Arrive in Hyderabad, evening walk at Necklace Road & Hussain Sagar" },
      { day: "Day 2", description: "Old City tour - Charminar, Mecca Masjid, Laad Bazaar bangle shopping" },
      { day: "Day 3", description: "Golconda Fort expedition + sound & light show in evening" },
      { day: "Day 4", description: "Chowmahalla Palace, Salar Jung Museum + biryani lunch tour" },
      { day: "Day 5", description: "Ramoji Film City or Hi-Tech City tour, departure" },
    ],
    location: "Telangana, India", rating: 4.5, reviews: 623, color: "#8b5cf6", bestSeason: "October-March",
    coordinates: { lat: 17.3850, lng: 78.4867 },
    nearestAirport: "Rajiv Gandhi International Airport (HYD, 22 km)",
    languages: ["Telugu", "Urdu", "Hindi", "English"],
    currency: "Indian Rupee (₹)", timeZone: "IST (UTC+5:30)",
    knownFor: ["Hyderabadi Biryani & Haleem", "Charminar & Golconda Fort", "Pearl & bangle markets", "IT hub - HITEC City"],
    altitude: "505 m", areaKm2: "7,100 km²", population: "10 million",
  },
  {
    id: "vizag",
    name: "Visakhapatnam",
    subtitle: "City of Destiny",
    description: "A stunning coastal city with pristine beaches, ancient caves, lush hills, and one of India's busiest ports.",
    longDescription: "Visakhapatnam (Vizag) is a port city in Andhra Pradesh, nestled between the Eastern Ghats and the Bay of Bengal. This 5-day coastal getaway takes you through the serene RK Beach, the 11th-century Simhachalam Temple, the submarine museum at INS Kursura, and the breathtaking Borra Caves (a short drive away). Explore the lush Kambalakonda Wildlife Sanctuary, watch the sunset at Yarada Beach, and visit the fascinating aquarium. Vizag's blend of natural beauty, naval history, and relaxed coastal vibe makes it a perfect weekend escape.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
      "https://images.unsplash.com/photo-1470071459604-a3a0d0f0a0c9?w=800&q=80",
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80",
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80",
    ],
    price: 5999, duration: "5 days", maxPeople: 25, tourGuides: 4,
    accommodation: "Beach Resort & Hotel", difficulty: "easy", category: "beach",
    highlights: ["RK Beach & Yarada Beach sunset", "INS Kursura submarine museum", "Simhachalam Temple (11th century)", "Kambalakonda Wildlife Sanctuary trek", "Borra Caves expedition", "VUDA Park & aquarium"],
    itinerary: [
      { day: "Day 1", description: "Arrive in Vizag, evening walk at RK Beach" },
      { day: "Day 2", description: "INS Kursura submarine museum + aquarium + VUDA Park" },
      { day: "Day 3", description: "Simhachalam Temple + Kambalakonda Wildlife Sanctuary" },
      { day: "Day 4", description: "Borra Caves day trip + Araku Valley scenic drive" },
      { day: "Day 5", description: "Yarada Beach sunrise + departure" },
    ],
    location: "Andhra Pradesh, India", rating: 4.4, reviews: 345, color: "#06b6d4", bestSeason: "October-March",
    coordinates: { lat: 17.6868, lng: 83.2185 },
    nearestAirport: "Visakhapatnam International Airport (VTZ, 8 km)",
    languages: ["Telugu", "Hindi", "English", "Urdu"],
    currency: "Indian Rupee (₹)", timeZone: "IST (UTC+5:30)",
    knownFor: ["Pristine beaches & sunset points", "INS Kursura Submarine Museum", "Simhachalam Temple", "Eastern Ghats trekking"],
    altitude: "Sea level", areaKm2: "640 km²", population: "2 million",
  },

  // ---- International Destinations ----
  {
    id: "bali",
    name: "Bali",
    subtitle: "Island of the Gods",
    description: "Tropical paradise with ancient temples, rice terraces, vibrant culture, and world-class surfing.",
    longDescription: "Bali is an Indonesian island known for its forested volcanic mountains, iconic rice paddies, beaches, and coral reefs. This 8-day journey immerses you in Balinese Hindu culture — unique to this island — takes you through Ubud's sacred monkey forests, Uluwatu's sea temples perched on cliffs, and the stunning Tegallalang rice terraces that date back to the 9th century. Relax on Seminyak's golden beaches, surf at world-class breaks, and watch unforgettable sunsets at Tanah Lot.",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
      "https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&q=80",
      "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800&q=80",
      "https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8?w=800&q=80",
    ],
    price: 24999, duration: "8 days", maxPeople: 25, tourGuides: 5,
    accommodation: "Beach Resort", difficulty: "easy", category: "beach",
    highlights: ["Tanah Lot sunset temple (16th century)", "Ubud monkey forest & rice terraces", "Uluwatu temple on cliff's edge", "Surfing at Seminyak", "Balinese cooking class", "Nusa Penida island excursion"],
    itinerary: [
      { day: "Day 1", description: "Arrive in Bali, transfer to Seminyak resort" },
      { day: "Day 2", description: "Beach day - surfing lesson and sunset cocktails" },
      { day: "Day 3", description: "Ubud tour - monkey forest, rice terraces, art markets" },
      { day: "Day 4", description: "Temple tour - Tanah Lot, Uluwatu, Kecak fire dance" },
      { day: "Day 5", description: "Balinese cooking class + spiritual purification" },
      { day: "Day 6", description: "Nusa Penida island day trip - stunning cliffs & beaches" },
      { day: "Day 7", description: "Free day for spa, shopping, or exploration" },
      { day: "Day 8", description: "Departure with Balinese souvenirs" },
    ],
    location: "Bali, Indonesia", rating: 4.9, reviews: 867, color: "#ec4899", bestSeason: "April-October",
    coordinates: { lat: -8.3405, lng: 115.0920 },
    nearestAirport: "Ngurah Rai International Airport (13 km from Kuta)",
    languages: ["Balinese", "Indonesian", "English"],
    currency: "Indonesian Rupiah (IDR)", timeZone: "WITA (UTC+8)",
    knownFor: ["Hindu temples & rice terraces", "Surfing & beach clubs", "Yoga & wellness retreats", "Balinese dance & art"],
    altitude: "Sea level (beaches) to 3,031m (Mt. Agung)", areaKm2: "5,780 km²", population: "4.3 million",
  },
  {
    id: "phuket",
    name: "Phuket",
    subtitle: "Pearl of the Andaman Sea",
    description: "Thailand's largest island with stunning beaches, vibrant nightlife, and rich cultural heritage.",
    longDescription: "Phuket is Thailand's largest island (576 km²), offering everything from pristine beaches and crystal-clear waters to vibrant nightlife and cultural landmarks. This 7-day expedition takes you through the famous Phi Phi Islands (made famous by 'The Beach' movie), James Bond Island in Phang Nga Bay, and the 45-meter-tall Big Buddha. Enjoy world-class snorkeling among coral reefs, authentic Thai massage, and incredible street food at the Sunday Walking Street Market.",
    image: "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=800&q=80",
      "https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?w=800&q=80",
      "https://images.unsplash.com/photo-1582561424758-d9f3a9c4f3f3?w=800&q=80",
      "https://images.unsplash.com/photo-1504214208698-ea1916a2195a?w=800&q=80",
    ],
    price: 19999, duration: "7 days", maxPeople: 30, tourGuides: 4,
    accommodation: "Beachfront Resort", difficulty: "easy", category: "beach",
    highlights: ["Phi Phi Islands snorkeling", "James Bond Island tour (Phang Nga Bay)", "Big Buddha at 45m tall", "Phuket Old Town walking tour", "Thai cooking class", "Sunday Walking Street Market"],
    itinerary: [
      { day: "Day 1", description: "Arrive in Phuket, check into beachfront resort" },
      { day: "Day 2", description: "Phi Phi Islands day trip - snorkeling & beach time" },
      { day: "Day 3", description: "James Bond Island & Phang Nga Bay tour" },
      { day: "Day 4", description: "Cultural tour - Big Buddha, Wat Chalong, Old Town" },
      { day: "Day 5", description: "Thai cooking class + evening Muay Thai show" },
      { day: "Day 6", description: "Free day - spa, shopping, or beach relaxation" },
      { day: "Day 7", description: "Departure with Thai memories" },
    ],
    location: "Phuket, Thailand", rating: 4.7, reviews: 654, color: "#06b6d4", bestSeason: "November-April",
    coordinates: { lat: 7.8804, lng: 98.3923 },
    nearestAirport: "Phuket International Airport (32 km from Patong)",
    languages: ["Thai", "English", "Chinese"],
    currency: "Thai Baht (฿)", timeZone: "ICT (UTC+7)",
    knownFor: ["Beach resorts & nightlife", "Phi Phi Islands", "Thai massage & spas", "Street food & seafood"],
    altitude: "Sea level", areaKm2: "576 km²", population: "600,000",
  },
  {
    id: "dubai",
    name: "Dubai",
    subtitle: "City of Gold & Superlatives",
    description: "Ultra-modern city with towering skyscrapers, luxury shopping, desert safaris, and world-class attractions.",
    longDescription: "Dubai is a futuristic metropolis in the UAE, famous for its luxury shopping, ultramodern architecture, and vibrant nightlife. This 6-day experience takes you to the top of Burj Khalifa (the world's tallest building at 828m), through the historic Al Fahidi district (est. 1900s), on a desert safari across the Arabian Desert, and to the man-made Palm Jumeirah archipelago visible from space. Experience the perfect blend of Bedouin tradition and futuristic innovation.",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80",
      "https://images.unsplash.com/photo-1518684079-3c6e05c9a7f0?w=800&q=80",
      "https://images.unsplash.com/photo-1546412414-e1885e5114d0?w=800&q=80",
      "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=800&q=80",
    ],
    price: 29999, duration: "6 days", maxPeople: 25, tourGuides: 4,
    accommodation: "5-Star Hotel", difficulty: "easy", category: "cultural",
    highlights: ["Burj Khalifa - world's tallest (828m)", "Desert safari with dune bashing", "Dubai Mall & fountain show", "Abra ride in Dubai Creek", "Palm Jumeirah & Atlantis", "Gold Souk & Spice Souk"],
    itinerary: [
      { day: "Day 1", description: "Arrive in Dubai, evening Dhow cruise in Marina" },
      { day: "Day 2", description: "Burj Khalifa, Dubai Mall, and fountain show" },
      { day: "Day 3", description: "Desert safari - dune bashing, camel ride, BBQ dinner" },
      { day: "Day 4", description: "Old Dubai - Gold Souk, Spice Souk, Abra ride" },
      { day: "Day 5", description: "Palm Jumeirah, Atlantis, and beach day" },
      { day: "Day 6", description: "Departure from Dubai" },
    ],
    location: "Dubai, UAE", rating: 4.6, reviews: 723, color: "#f59e0b", bestSeason: "November-March",
    coordinates: { lat: 25.2048, lng: 55.2708 },
    nearestAirport: "Dubai International Airport (DXB, 5 km from city center)",
    languages: ["Arabic", "English", "Hindi", "Urdu"],
    currency: "UAE Dirham (AED)", timeZone: "GST (UTC+4)",
    knownFor: ["Burj Khalifa & luxury shopping", "Desert safaris", "Gold & spice souks", "World Expo legacy"],
    altitude: "Sea level", areaKm2: "4,114 km²", population: "3.6 million",
  },
  {
    id: "krabi",
    name: "Krabi",
    subtitle: "Tropical Cliffside Paradise",
    description: "Dramatic limestone cliffs, emerald waters, and secluded beaches make Krabi a tropical dream.",
    longDescription: "Krabi province in southern Thailand is famous for its stunning karst landscape, with towering limestone cliffs jutting out of emerald-green waters. This 6-day adventure takes you through Railay Beach's world-class rock climbing spots (over 700 climbing routes), the famous Four Islands, and the hidden Emerald Pool in Thung Teao Forest. Perfect for adventurers and beach lovers alike, Krabi offers a more relaxed alternative to Phuket with equally stunning scenery.",
    image: "https://images.unsplash.com/photo-1589883661923-6476cb0ae9f2?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1589883661923-6476cb0ae9f2?w=800&q=80",
      "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&q=80",
      "https://images.unsplash.com/photo-1504214208698-ea1916a2195a?w=800&q=80",
    ],
    price: 17999, duration: "6 days", maxPeople: 20, tourGuides: 4,
    accommodation: "Beach Bungalow", difficulty: "medium", category: "adventure",
    highlights: ["Railay Beach rock climbing (700+ routes)", "Four Islands snorkeling tour", "Emerald Pool & hot springs", "Hong Islands lagoon kayaking", "Tiger Cave Temple (1,237 steps)", "Phra Nang Cave beach"],
    itinerary: [
      { day: "Day 1", description: "Arrive in Krabi, check into beach bungalow" },
      { day: "Day 2", description: "Railay Beach - rock climbing and lagoon exploration" },
      { day: "Day 3", description: "Four Islands tour - snorkeling and beach hopping" },
      { day: "Day 4", description: "Emerald Pool, hot springs, and Tiger Cave Temple" },
      { day: "Day 5", description: "Hong Islands kayaking and sunset cruise" },
      { day: "Day 6", description: "Departure with tropical memories" },
    ],
    location: "Krabi, Thailand", rating: 4.7, reviews: 445, color: "#22c55e", bestSeason: "November-April",
    coordinates: { lat: 8.0863, lng: 98.9063 },
    nearestAirport: "Krabi International Airport (15 km from Ao Nang)",
    languages: ["Thai", "English"],
    currency: "Thai Baht (฿)", timeZone: "ICT (UTC+7)",
    knownFor: ["Limestone karst islands", "Rock climbing", "Emerald Pool", "Longtail boat tours"],
    altitude: "Sea level", areaKm2: "4,709 km²", population: "473,000",
  },
  {
    id: "santorini",
    name: "Santorini",
    subtitle: "The Aegean Dream",
    description: "Iconic white-washed buildings, blue domes, volcanic beaches, and legendary sunsets.",
    longDescription: "Santorini is a breathtaking Greek island in the Aegean Sea, famous for its dramatic caldera views — formed by one of the largest volcanic eruptions in history (circa 1600 BCE). Whitewashed villages with blue-domed churches cling to cliff edges, overlooking the deep blue sea. This 7-day romantic getaway takes you through the charming streets of Oia and Fira, volcanic hot springs, the ancient ruins of Akrotiri (a Minoan Bronze Age settlement), and local wine tasting with panoramic caldera views.",
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80",
      "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800&q=80",
      "https://images.unsplash.com/photo-1604580864964-0462f5d5b1a8?w=800&q=80",
      "https://images.unsplash.com/photo-1571201313253-8f4e503dc7a9?w=800&q=80",
    ],
    price: 44999, duration: "7 days", maxPeople: 20, tourGuides: 5,
    accommodation: "Caldera View Hotel", difficulty: "easy", category: "romantic",
    highlights: ["Oia sunset viewed from castle ruins", "Volcanic hot springs boat tour", "Akrotiri ruins (Minoan, 1600 BCE)", "Santorini wine tasting (Assyrtiko grape)", "Red Beach & Kamari black sand beach", "Fira to Oia coastal hike (10 km)"],
    itinerary: [
      { day: "Day 1", description: "Arrive in Santorini, check into caldera view hotel" },
      { day: "Day 2", description: "Explore Oia - blue domes, boutiques, famous sunset" },
      { day: "Day 3", description: "Volcano boat tour - hot springs and Thirassia island" },
      { day: "Day 4", description: "Akrotiri ruins and Red Beach exploration" },
      { day: "Day 5", description: "Wine tasting tour across the island" },
      { day: "Day 6", description: "Free day - beach time, shopping, or photography" },
      { day: "Day 7", description: "Departure from Santorini" },
    ],
    location: "Santorini, Greece", rating: 4.9, reviews: 891, color: "#3b82f6", bestSeason: "June-September",
    coordinates: { lat: 36.3932, lng: 25.4615 },
    nearestAirport: "Santorini (Thira) National Airport (6 km from Fira)",
    languages: ["Greek", "English"],
    currency: "Euro (€)", timeZone: "EET (UTC+2)",
    knownFor: ["Caldera sunsets & blue domes", "Volcanic beaches & wine", "Akrotiri archaeological site", "Luxury honeymoon destination"],
    altitude: "0-567 m (Mount Profitis Ilias)", areaKm2: "76 km²", population: "15,500",
  },
  {
    id: "kerala",
    name: "Kerala Backwaters",
    subtitle: "God's Own Country",
    description: "Serene backwaters, lush greenery, Ayurvedic wellness, and unique houseboat experiences.",
    longDescription: "Kerala, India's tropical paradise, is renowned for its tranquil backwaters — a 900 km network of interconnected canals, rivers, lakes, and inlets. This 6-day wellness journey takes you through the famous Alleppey backwaters on a traditional Kettuvallam houseboat, Munnar's tea gardens, and Kochi's colonial ports. Experience authentic Ayurvedic treatments that originated here over 3,000 years ago, watch Kathakali dance performances, and savor delicious Kerala cuisine with its distinctive use of coconut and spices.",
    image: "https://images.unsplash.com/photo-1593693397690-362cb9666fc3?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1593693397690-362cb9666fc3?w=800&q=80",
      "https://images.unsplash.com/photo-1580136579312-94651dfd596d?w=800&q=80",
      "https://images.unsplash.com/photo-1559650656-5d1d361ad10e?w=800&q=80",
    ],
    price: 12999, duration: "6 days", maxPeople: 15, tourGuides: 4,
    accommodation: "Houseboat & Ayurvedic Resort", difficulty: "easy", category: "romantic",
    highlights: ["Alleppey houseboat cruise (900 km canals)", "Ayurvedic massage & wellness (3,000 year tradition)", "Kochi Fort & Chinese fishing nets", "Kathakali dance performance", "Kerala seafood feast", "Spice market tour"],
    itinerary: [
      { day: "Day 1", description: "Arrive in Kochi, explore Fort Kochi" },
      { day: "Day 2", description: "Kochi sightseeing - Chinese nets, Mattancherry Palace" },
      { day: "Day 3", description: "Transfer to Alleppey, board luxury houseboat" },
      { day: "Day 4", description: "Houseboat cruise through backwaters - overnight stay" },
      { day: "Day 5", description: "Ayurvedic wellness day - massage, yoga, treatments" },
      { day: "Day 6", description: "Departure with Kerala spices" },
    ],
    location: "Kerala, India", rating: 4.7, reviews: 534, color: "#84cc16", bestSeason: "October-March",
    coordinates: { lat: 9.4981, lng: 76.3388 },
    nearestAirport: "Cochin International Airport (28 km from Alleppey)",
    languages: ["Malayalam", "English", "Hindi", "Tamil"],
    currency: "Indian Rupee (₹)", timeZone: "IST (UTC+5:30)",
    knownFor: ["Backwater houseboats", "Ayurvedic treatments", "Kathakali dance", "Spices & seafood"],
    altitude: "Sea level", areaKm2: "38,863 km²", population: "35 million",
  },
  {
    id: "tokyo",
    name: "Tokyo",
    subtitle: "Where Tradition Meets Future",
    description: "A dazzling metropolis blending ancient temples, neon-lit skyscrapers, and unmatched culinary culture.",
    longDescription: "Tokyo is a city of contrasts, where centuries-old temples stand alongside neon-lit skyscrapers. This 8-day cultural immersion takes you through the historic Asakusa district (home to Senso-ji, Tokyo's oldest temple, est. 645 AD), the bustling Shibuya crossing (the world's busiest pedestrian intersection with 3,000 people per crossing), serene Meiji Shrine, and the quirky Harajuku fashion scene. Experience authentic sushi at the Tsukiji outer market, traditional tea ceremonies, and the unmatched magic of Japanese omotenashi (hospitality).",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80",
      "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=800&q=80",
      "https://images.unsplash.com/photo-1551641506-ee5bf4cb45f1?w=800&q=80",
      "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&q=80",
    ],
    price: 49999, duration: "8 days", maxPeople: 20, tourGuides: 6,
    accommodation: "Business Hotel", difficulty: "easy", category: "cultural",
    highlights: ["Shibuya crossing - 3,000 people/crossing", "Senso-ji temple - Tokyo's oldest (645 AD)", "Tsukiji outer market sushi", "Akihabara electronics district", "Mount Fuji & Hakone day trip", "TeamLab Borderless digital art"],
    itinerary: [
      { day: "Day 1", description: "Arrive in Tokyo, Shinjuku evening exploration" },
      { day: "Day 2", description: "Asakusa, Senso-ji temple, and Sky Tree" },
      { day: "Day 3", description: "Shibuya, Harajuku, and Meiji Shrine" },
      { day: "Day 4", description: "Tsukiji market breakfast + Akihabara" },
      { day: "Day 5", description: "Mount Fuji & Hakone day trip" },
      { day: "Day 6", description: "TeamLab Borderless + Odaiba" },
      { day: "Day 7", description: "Free day - explore at your pace" },
      { day: "Day 8", description: "Departure from Tokyo" },
    ],
    location: "Tokyo, Japan", rating: 4.8, reviews: 978, color: "#ef4444", bestSeason: "March-May / October-November",
    coordinates: { lat: 35.6762, lng: 139.6503 },
    nearestAirport: "Narita International Airport (75 km) / Haneda Airport (18 km)",
    languages: ["Japanese", "English (limited)"],
    currency: "Japanese Yen (¥)", timeZone: "JST (UTC+9)",
    knownFor: ["Senso-ji & Meiji Shrine", "Shibuya & Shinjuku", "Sushi & ramen culture", "Cherry blossoms & neon lights"],
    altitude: "40 m", areaKm2: "2,194 km²", population: "14 million (Tokyo Metro: 37 million)",
  },
];

export const getTourById = (id: string): Tour | undefined => {
  return tours.find((tour) => tour.id === id);
};

export const getToursByCategory = (category: TourCategory): Tour[] => {
  return tours.filter((tour) => tour.category === category);
};

export const getToursByDifficulty = (difficulty: Tour["difficulty"]): Tour[] => {
  return tours.filter((tour) => tour.difficulty === difficulty);
};

export type PriceTier = "budget" | "mid-range" | "premium";

export const priceTiers: { id: PriceTier; label: string; badge: string; color: string; max: number }[] = [
  { id: "budget", label: "Budget", badge: "🔥 Under ₹10K", color: "#22c55e", max: 10000 },
  { id: "mid-range", label: "Mid-Range", badge: "💎 ₹10K-₹25K", color: "#f59e0b", max: 25000 },
  { id: "premium", label: "Premium", badge: "🌟 ₹25K+", color: "#ef4444", max: Infinity },
];

export const getPriceTier = (price: number): PriceTier => {
  if (price < 10000) return "budget";
  if (price <= 25000) return "mid-range";
  return "premium";
};

export const getPriceTierInfo = (price: number) => {
  const tier = getPriceTier(price);
  return priceTiers.find((t) => t.id === tier)!;
};
