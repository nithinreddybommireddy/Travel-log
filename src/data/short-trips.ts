export interface ShortTrip {
  id: string;
  tourId: string;
  name: string;
  description: string;
  image: string;
  price: number;
  duration: string;
  rating: number;
  reviews: number;
  landmarks: string[];
  bestTime: string;
  category: "historical" | "nature" | "spiritual" | "adventure" | "cultural" | "food" | "shopping" | "wildlife" | "romantic";
  coordinates: { lat: number; lng: number };
  popular: boolean;
}

export const shortTrips: ShortTrip[] = [
  // ────────── MANALI ──────────
  {
    id: "manali-hadimba",
    tourId: "manali",
    name: "Hadimba Temple & Old Manali Walk",
    description: "Visit the ancient 16th-century Hadimba Temple surrounded by cedar forests, then explore the charming Old Manali village with its hippie cafes and apple orchards.",
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80",
    price: 500, duration: "3-4 hours", rating: 4.7, reviews: 215,
    landmarks: ["Hadimba Temple", "Old Manali Bridge", "Manu Temple", "Apple Orchards"],
    bestTime: "Morning (9 AM - 1 PM)", category: "cultural",
    coordinates: { lat: 32.2430, lng: 77.1830 }, popular: true,
  },
  {
    id: "manali-solang",
    tourId: "manali",
    name: "Solang Valley Adventure",
    description: "Thrilling adventure sports at Solang Valley — paragliding, zorbing, and the famous ropeway ride with panoramic Himalayan views.",
    image: "https://images.unsplash.com/photo-1582653291997-079a1c04e5a1?w=800&q=80",
    price: 1500, duration: "4-5 hours", rating: 4.8, reviews: 389,
    landmarks: ["Solang Valley", "Ropeway", "Paragliding Point", "Snow Point"],
    bestTime: "Morning (8 AM - 1 PM)", category: "adventure",
    coordinates: { lat: 32.3100, lng: 77.1500 }, popular: true,
  },
  {
    id: "manali-hot-springs",
    tourId: "manali",
    name: "Vashisht Hot Springs & Village",
    description: "Relax in natural sulphur hot springs at Vashisht village, explore the ancient temple, and enjoy local Himachali cuisine by the river.",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
    price: 300, duration: "2-3 hours", rating: 4.5, reviews: 156,
    landmarks: ["Vashisht Temple", "Hot Springs", "River Cafe", "Local Crafts Market"],
    bestTime: "Evening (4 PM - 7 PM)", category: "spiritual",
    coordinates: { lat: 32.2480, lng: 77.1960 }, popular: false,
  },
  {
    id: "manali-tibetan",
    tourId: "manali",
    name: "Tibetan Monastery Tour",
    description: "Explore the peaceful Gadhan Thekchhokling Gompa monastery, taste authentic Tibetan momos and thukpa, and shop for handicrafts.",
    image: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&q=80",
    price: 400, duration: "2-3 hours", rating: 4.4, reviews: 124,
    landmarks: ["Gadhan Thekchhokling Gompa", "Tibetan Market", "Mall Road", "Handicraft Centre"],
    bestTime: "Afternoon (2 PM - 5 PM)", category: "cultural",
    coordinates: { lat: 32.2420, lng: 77.1950 }, popular: false,
  },

  // ────────── GOA ──────────
  {
    id: "goa-baga",
    tourId: "goa",
    name: "Baga Beach & Water Sports",
    description: "The most popular beach in North Goa — parasailing, jet skiing, banana boat rides, and sunset cocktails at beach shacks.",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80",
    price: 1200, duration: "4-5 hours", rating: 4.6, reviews: 567,
    landmarks: ["Baga Beach", "Chapora Fort", "Baga Creek", "Tito's Lane"],
    bestTime: "Morning (9 AM - 2 PM)", category: "adventure",
    coordinates: { lat: 15.5600, lng: 73.7500 }, popular: true,
  },
  {
    id: "goa-old-goa",
    tourId: "goa",
    name: "Old Goa Churches Tour",
    description: "UNESCO-listed Basilica of Bom Jesus and Se Cathedral — 16th-century Portuguese architecture with stunning baroque interiors.",
    image: "https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&q=80",
    price: 500, duration: "2-3 hours", rating: 4.8, reviews: 432,
    landmarks: ["Basilica of Bom Jesus", "Se Cathedral", "Church of St. Francis", "Archaeological Museum"],
    bestTime: "Morning (10 AM - 1 PM)", category: "historical",
    coordinates: { lat: 15.5030, lng: 73.9120 }, popular: true,
  },
  {
    id: "goa-spice",
    tourId: "goa",
    name: "Spice Plantation & Lunch",
    description: "Tour a tropical spice plantation, learn about spices like cardamom, pepper and vanilla, and enjoy a traditional Goan lunch.",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80",
    price: 800, duration: "3-4 hours", rating: 4.5, reviews: 298,
    landmarks: ["Spice Plantation", "Elephant Bathing", "Traditional Lunch", "Spice Shop"],
    bestTime: "Late Morning (11 AM - 3 PM)", category: "food",
    coordinates: { lat: 15.4940, lng: 73.9860 }, popular: false,
  },
  {
    id: "goa-sunset-cruise",
    tourId: "goa",
    name: "Mandovi River Sunset Cruise",
    description: "A romantic sunset cruise on the Mandovi River with live music, Goan folk dance, and unlimited drinks under the stars.",
    image: "https://images.unsplash.com/photo-1540202404-a2f29016b523?w=800&q=80",
    price: 600, duration: "2 hours", rating: 4.6, reviews: 345,
    landmarks: ["Mandovi River", "Panjim Jetty", "Casino Cruise View", "Feni Tasting"],
    bestTime: "Sunset (5 PM - 7 PM)", category: "cultural",
    coordinates: { lat: 15.4980, lng: 73.8240 }, popular: true,
  },

  // ────────── HYDERABAD ──────────
  {
    id: "hyd-charminar",
    tourId: "hyderabad",
    name: "Charminar & Laad Bazaar",
    description: "Visit the iconic 1591 Charminar, shop for bangles at Laad Bazaar, and taste authentic Hyderabadi biryani at famous local restaurants.",
    image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&q=80",
    price: 300, duration: "3-4 hours", rating: 4.6, reviews: 723,
    landmarks: ["Charminar", "Laad Bazaar", "Mecca Masjid", "Nizam's Museum", "Biryani at Paradise"],
    bestTime: "Evening (5 PM - 9 PM)", category: "historical",
    coordinates: { lat: 17.3616, lng: 78.4747 }, popular: true,
  },
  {
    id: "hyd-golconda",
    tourId: "hyderabad",
    name: "Golconda Fort Expedition",
    description: "Explore the majestic 13th-century Golconda Fort with its legendary acoustic system, light & sound show, and panoramic city views.",
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80",
    price: 400, duration: "3-4 hours", rating: 4.7, reviews: 512,
    landmarks: ["Golconda Fort", "Fateh Darwaza", "Sound & Light Show", "Taramati Baradari", "Qutb Shahi Tombs"],
    bestTime: "Late Afternoon (3 PM - 7 PM for light show)", category: "historical",
    coordinates: { lat: 17.3833, lng: 78.4011 }, popular: true,
  },
  {
    id: "hyd-tankbund",
    tourId: "hyderabad",
    name: "Tank Bund & Hussain Sagar",
    description: "Stroll along the famous Tank Bund road with 35+ statues of famous personalities, enjoy boating at Hussain Sagar lake, and see the giant Buddha statue.",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80",
    price: 200, duration: "2-3 hours", rating: 4.3, reviews: 289,
    landmarks: ["Tank Bund", "Hussain Sagar Lake", "Buddha Statue", "Lumbini Park", "Necklace Road"],
    bestTime: "Evening (4 PM - 7 PM)", category: "nature",
    coordinates: { lat: 17.4240, lng: 78.4640 }, popular: true,
  },
  {
    id: "hyd-zoo",
    tourId: "hyderabad",
    name: "Nehru Zoological Park",
    description: "One of India's largest zoos spanning 380 acres — safari rides, white tigers, and over 1,500 species of birds and animals.",
    image: "https://images.unsplash.com/photo-1470071459604-a3a0d0f0a0c9?w=800&q=80",
    price: 250, duration: "4-5 hours", rating: 4.4, reviews: 376,
    landmarks: ["Nehru Zoo", "Safari Rides", "Butterfly Park", "Natural History Museum", "Toy Train"],
    bestTime: "Morning (8 AM - 12 PM)", category: "wildlife",
    coordinates: { lat: 17.3510, lng: 78.4490 }, popular: false,
  },

  // ────────── MUNNAR ──────────
  {
    id: "munnar-tea",
    tourId: "munnar",
    name: "Tea Museum & Plantation Walk",
    description: "Discover Munnar's tea heritage since 1877 at the Tea Museum, walk through rolling tea gardens, and taste fresh single-estate tea.",
    image: "https://images.unsplash.com/photo-1597225244664-8a6e1f1e5b1e?w=800&q=80",
    price: 500, duration: "3 hours", rating: 4.7, reviews: 312,
    landmarks: ["Tea Museum", "Tea Plantations", "Tasting Room", "Photography Point"],
    bestTime: "Morning (9 AM - 12 PM)", category: "cultural",
    coordinates: { lat: 10.0900, lng: 77.0630 }, popular: true,
  },
  {
    id: "munnar-echo",
    tourId: "munnar",
    name: "Echo Point & Kundala Lake",
    description: "A scenic drive to Echo Point where your voice echoes across the valley, followed by boating at the serene Kundala Lake with lush hills all around.",
    image: "https://images.unsplash.com/photo-1559650656-5d1d361ad10e?w=800&q=80",
    price: 400, duration: "3-4 hours", rating: 4.5, reviews: 234,
    landmarks: ["Echo Point", "Kundala Lake", "Mattupetty Dam", "Floral Garden"],
    bestTime: "Morning (9 AM - 1 PM)", category: "nature",
    coordinates: { lat: 10.1100, lng: 77.1250 }, popular: false,
  },

  // ────────── ARAKU ──────────
  {
    id: "araku-coffee",
    tourId: "araku",
    name: "Coffee Plantation & Tribal Museum",
    description: "Tour award-winning Arabica coffee plantations, learn the bean-to-cup process, and explore the fascinating tribal museum showcasing 75 local tribes.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    price: 350, duration: "3-4 hours", rating: 4.5, reviews: 145,
    landmarks: ["Coffee Plantation", "Tribal Museum", "Coffee Tasting", "Tribal Dance Show"],
    bestTime: "Morning (9 AM - 1 PM)", category: "cultural",
    coordinates: { lat: 18.3270, lng: 82.8760 }, popular: true,
  },
  {
    id: "araku-borra",
    tourId: "araku",
    name: "Borra Caves Expedition",
    description: "Explore the million-year-old limestone caves with stunning stalactite and stalagmite formations, naturally lit by a skylight opening.",
    image: "https://images.unsplash.com/photo-1470071459604-a3a0d0f0a0c9?w=800&q=80",
    price: 500, duration: "2-3 hours", rating: 4.6, reviews: 198,
    landmarks: ["Borra Caves", "Gosthani River", "Shiva Lingam Formation", "Skylight Opening"],
    bestTime: "Morning (10 AM - 1 PM)", category: "nature",
    coordinates: { lat: 18.2810, lng: 83.0820 }, popular: true,
  },

  // ────────── PONDICHERRY ──────────
  {
    id: "pondy-french",
    tourId: "pondicherry",
    name: "French Quarter Heritage Walk",
    description: "Walk through the charming White Town with 18th-century French colonial buildings, bougainvillea-lined streets, and chic boutiques.",
    image: "https://images.unsplash.com/photo-1555126634-323283e090fa?w=800&q=80",
    price: 400, duration: "2-3 hours", rating: 4.7, reviews: 356,
    landmarks: ["French Quarter", "Promenade Beach", "Raj Niwas", "Notre Dame Church", "Boutique Cafes"],
    bestTime: "Morning (7 AM - 10 AM) or Evening (4 PM - 7 PM)", category: "cultural",
    coordinates: { lat: 11.9350, lng: 79.8330 }, popular: true,
  },
  {
    id: "pondy-aurovile",
    tourId: "pondicherry",
    name: "Auroville & Matrimandir",
    description: "Visit the experimental township of Auroville, see the iconic golden Matrimandir, and experience meditation at the world's most unique spiritual community.",
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80",
    price: 300, duration: "3-4 hours", rating: 4.6, reviews: 267,
    landmarks: ["Matrimandir", "Auroville Visitor Centre", "Guest Pavilion", "Boutique & Cafe"],
    bestTime: "Morning (9 AM - 1 PM)", category: "spiritual",
    coordinates: { lat: 12.0030, lng: 79.8100 }, popular: true,
  },

  // ────────── KEDARNATH ──────────
  {
    id: "kedar-temple",
    tourId: "kedarnath",
    name: "Kedarnath Temple Darshan",
    description: "Experience the divine darshan at the 8th-century Kedarnath Temple, one of the 12 Jyotirlingas, with the majestic Himalayas as backdrop.",
    image: "https://images.unsplash.com/photo-1566837945700-30057527ade0?w=800&q=80",
    price: 200, duration: "2-3 hours", rating: 4.9, reviews: 567,
    landmarks: ["Kedarnath Temple", "Adi Shankaracharya Samadhi", "Bhairav Temple", "Gandhi Sarovar"],
    bestTime: "Morning (4 AM - 8 AM for Aarti)", category: "spiritual",
    coordinates: { lat: 30.7340, lng: 79.0660 }, popular: true,
  },
  {
    id: "kedar-gaurikund",
    tourId: "kedarnath",
    name: "Gaurikund Thermal Springs",
    description: "Take a dip in the natural thermal springs of Gaurikund, believed to have medicinal properties, located at the start of the Kedarnath trek.",
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80",
    price: 100, duration: "1-2 hours", rating: 4.4, reviews: 189,
    landmarks: ["Gaurikund Temple", "Thermal Springs", "Trek Start Point", "River Mandakini"],
    bestTime: "Afternoon (2 PM - 4 PM)", category: "spiritual",
    coordinates: { lat: 30.5560, lng: 79.0830 }, popular: false,
  },

  // ────────── BALI ──────────
  {
    id: "bali-ubud",
    tourId: "bali",
    name: "Ubud Rice Terraces & Monkey Forest",
    description: "Walk through the stunning 9th-century Tegallalang rice terraces, visit the Sacred Monkey Forest, and explore Ubud's art markets.",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
    price: 5000, duration: "5-6 hours", rating: 4.8, reviews: 789,
    landmarks: ["Tegallalang Rice Terraces", "Sacred Monkey Forest", "Ubud Art Market", "Ubud Palace", "Campuhan Ridge"],
    bestTime: "Morning (7 AM - 1 PM)", category: "nature",
    coordinates: { lat: -8.5069, lng: 115.2625 }, popular: true,
  },
  {
    id: "bali-tanah",
    tourId: "bali",
    name: "Tanah Lot & Uluwatu Temples",
    description: "Visit two of Bali's most iconic sea temples — Tanah Lot perched on a rock formation and Uluwatu on a cliff's edge with stunning sunset views.",
    image: "https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&q=80",
    price: 4000, duration: "4-5 hours", rating: 4.7, reviews: 654,
    landmarks: ["Tanah Lot Temple", "Uluwatu Temple", "Kecak Fire Dance", "Cliff Viewpoint"],
    bestTime: "Late Afternoon (3 PM - 7 PM for sunset)", category: "historical",
    coordinates: { lat: -8.6213, lng: 115.0868 }, popular: true,
  },

  // ────────── PHUKET ──────────
  {
    id: "phuket-big-buddha",
    tourId: "phuket",
    name: "Big Buddha & Wat Chalong",
    description: "Visit the iconic 45m-tall Big Buddha atop Nakkerd Hill with panoramic views, then explore the ornate Wat Chalong temple complex.",
    image: "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=800&q=80",
    price: 2000, duration: "3-4 hours", rating: 4.6, reviews: 445,
    landmarks: ["Big Buddha", "Wat Chalong", "Nakkerd Hill Viewpoint", "Phuket Old Town"],
    bestTime: "Morning (8 AM - 12 PM)", category: "spiritual",
    coordinates: { lat: 7.8280, lng: 98.3130 }, popular: true,
  },
  {
    id: "phuket-phi-phi",
    tourId: "phuket",
    name: "Phi Phi Islands Day Trip",
    description: "Speedboat to the stunning Phi Phi Islands — snorkel in crystal-clear waters, visit Maya Bay (The Beach movie), and enjoy a beachside lunch.",
    image: "https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?w=800&q=80",
    price: 8000, duration: "Full Day (8 AM - 5 PM)", rating: 4.9, reviews: 876,
    landmarks: ["Phi Phi Don", "Maya Bay", "Viking Cave", "Pileh Lagoon", "Monkey Beach"],
    bestTime: "Early Morning Departure (8 AM)", category: "adventure",
    coordinates: { lat: 7.7400, lng: 98.7780 }, popular: true,
  },

  // ────────── DUBAI ──────────
  {
    id: "dubai-burj",
    tourId: "dubai",
    name: "Burj Khalifa & Dubai Mall",
    description: "Go to the top of the world's tallest building (828m), shop at the Dubai Mall with 1,200+ stores, and watch the spectacular fountain show.",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80",
    price: 10000, duration: "4-5 hours", rating: 4.8, reviews: 912,
    landmarks: ["Burj Khalifa At The Top", "Dubai Mall", "Dubai Aquarium", "Fountain Show", "Souk Al Bahar"],
    bestTime: "Evening (4 PM - 9 PM for fountain & sunset)", category: "cultural",
    coordinates: { lat: 25.1972, lng: 55.2744 }, popular: true,
  },
  {
    id: "dubai-old-city",
    tourId: "dubai",
    name: "Old Dubai & Gold Souk",
    description: "Cross Dubai Creek on an abra (wooden boat), explore the aromatic Spice Souk and glittering Gold Souk, and visit the Al Fahidi historical district.",
    image: "https://images.unsplash.com/photo-1518684079-3c6e05c9a7f0?w=800&q=80",
    price: 1500, duration: "3-4 hours", rating: 4.5, reviews: 534,
    landmarks: ["Dubai Creek", "Gold Souk", "Spice Souk", "Al Fahidi Fort", "Textile Souk"],
    bestTime: "Morning (9 AM - 1 PM)", category: "shopping",
    coordinates: { lat: 25.2867, lng: 55.2967 }, popular: true,
  },

  // ────────── KRABI ──────────
  {
    id: "krabi-railay",
    tourId: "krabi",
    name: "Railay Beach Rock Climbing",
    description: "World-class rock climbing on limestone cliffs with over 700 routes — all levels welcome — plus lagoon swimming and Phra Nang Cave beach.",
    image: "https://images.unsplash.com/photo-1589883661923-6476cb0ae9f2?w=800&q=80",
    price: 5000, duration: "Half day (4-5 hours)", rating: 4.8, reviews: 312,
    landmarks: ["Railay Beach", "Phra Nang Cave", "Lagoon Trail", "Viewpoint", "Climbing Routes"],
    bestTime: "Morning (7 AM - 12 PM, cooler)", category: "adventure",
    coordinates: { lat: 8.0100, lng: 98.8380 }, popular: true,
  },
  {
    id: "krabi-emerald",
    tourId: "krabi",
    name: "Emerald Pool & Hot Springs",
    description: "Swim in the stunning natural Emerald Pool surrounded by rainforest, then relax at the Thung Teao Forest hot springs — a hidden paradise.",
    image: "https://images.unsplash.com/photo-1504214208698-ea1916a2195a?w=800&q=80",
    price: 1500, duration: "3-4 hours", rating: 4.6, reviews: 267,
    landmarks: ["Emerald Pool", "Hot Springs Waterfall", "Thung Teao Forest", "Blue Pool"],
    bestTime: "Morning (8 AM - 12 PM)", category: "nature",
    coordinates: { lat: 7.9050, lng: 98.7850 }, popular: true,
  },

  // ────────── SANTORINI ──────────
  {
    id: "santorini-oia",
    tourId: "santorini",
    name: "Oia Sunset & Blue Domes",
    description: "Explore the iconic blue-domed churches of Oia, stroll through white-washed alleys, and watch the world-famous sunset from the castle ruins.",
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80",
    price: 3000, duration: "3-4 hours", rating: 4.9, reviews: 1023,
    landmarks: ["Oia Castle", "Blue Domes", "Amoudi Bay", "Sunset Viewpoint", "Art Galleries"],
    bestTime: "Late Afternoon (4 PM - 8 PM for sunset)", category: "romantic",
    coordinates: { lat: 36.4613, lng: 25.3750 }, popular: true,
  },
  {
    id: "santorini-wine",
    tourId: "santorini",
    name: "Santorini Wine Tasting",
    description: "Tour volcanic vineyards growing the rare Assyrtiko grape, taste 8+ local wines at 3 family-run wineries with caldera views.",
    image: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800&q=80",
    price: 6000, duration: "4-5 hours", rating: 4.7, reviews: 567,
    landmarks: ["Wine Museum", "Volcanic Vineyards", "Tasting Rooms", "Caldera Viewpoints"],
    bestTime: "Afternoon (2 PM - 7 PM)", category: "food",
    coordinates: { lat: 36.4250, lng: 25.4280 }, popular: true,
  },

  // ────────── KERALA ──────────
  {
    id: "kerala-fort-kochi",
    tourId: "kerala",
    name: "Fort Kochi Heritage Walk",
    description: "Explore 500-year-old colonial history at Fort Kochi — the iconic Chinese fishing nets, St. Francis Church, and Dutch Palace with murals.",
    image: "https://images.unsplash.com/photo-1593693397690-362cb9666fc3?w=800&q=80",
    price: 400, duration: "3-4 hours", rating: 4.6, reviews: 432,
    landmarks: ["Chinese Fishing Nets", "St. Francis Church", "Mattancherry Palace", "Jew Town", "Santa Cruz Basilica"],
    bestTime: "Morning (7 AM - 11 AM)", category: "historical",
    coordinates: { lat: 9.9660, lng: 76.2420 }, popular: true,
  },
  {
    id: "kerala-kathakali",
    tourId: "kerala",
    name: "Kathakali Dance & Kerala Dinner",
    description: "Watch a mesmerizing Kathakali dance performance with elaborate costumes, then enjoy a traditional Kerala sadya (feast) on a banana leaf.",
    image: "https://images.unsplash.com/photo-1559650656-5d1d361ad10e?w=800&q=80",
    price: 600, duration: "3 hours", rating: 4.8, reviews: 345,
    landmarks: ["Kathakali Centre", "Kerala Sadya Dinner", "Makeup Session (pre-show)", "Cooking Demo"],
    bestTime: "Evening (6 PM - 9 PM)", category: "cultural",
    coordinates: { lat: 9.9570, lng: 76.2420 }, popular: true,
  },

  // ────────── TOKYO ──────────
  {
    id: "tokyo-asakusa",
    tourId: "tokyo",
    name: "Asakusa & Senso-ji Temple",
    description: "Visit Tokyo's oldest temple Senso-ji (645 AD), walk Nakamise Street with traditional snacks, and see the stunning Tokyo Skytree nearby.",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80",
    price: 5000, duration: "3-4 hours", rating: 4.7, reviews: 856,
    landmarks: ["Senso-ji Temple", "Nakamise Street", "Kaminarimon Gate", "Tokyo Skytree", "Sumida Park"],
    bestTime: "Morning (8 AM - 12 PM, less crowded)", category: "historical",
    coordinates: { lat: 35.7148, lng: 139.7967 }, popular: true,
  },
  {
    id: "tokyo-shibuya",
    tourId: "tokyo",
    name: "Shibuya & Harajuku Experience",
    description: "Cross the famous Shibuya Scramble (3,000 people per crossing), visit the Meiji Shrine, and explore Harajuku's crazy Takeshita Street fashion.",
    image: "https://images.unsplash.com/photo-1551641506-ee5bf4cb45f1?w=800&q=80",
    price: 3000, duration: "4-5 hours", rating: 4.6, reviews: 723,
    landmarks: ["Shibuya Crossing", "Hachiko Statue", "Meiji Shrine", "Takeshita Street", "Omotesando"],
    bestTime: "Late Morning (10 AM - 3 PM)", category: "cultural",
    coordinates: { lat: 35.6595, lng: 139.7004 }, popular: true,
  },
  {
    id: "tokyo-tsukiji",
    tourId: "tokyo",
    name: "Tsukiji Outer Market Food Tour",
    description: "Sample the freshest sushi, grilled seafood, tamagoyaki, and matcha treats at the Tsukiji outer market — a food lover's paradise.",
    image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&q=80",
    price: 6000, duration: "2-3 hours", rating: 4.8, reviews: 645,
    landmarks: ["Tsukiji Outer Market", "Sushi Alley", "Matcha Stands", "Kitchen Street", "Seafood Sellers"],
    bestTime: "Morning (7 AM - 11 AM for freshest sushi)", category: "food",
    coordinates: { lat: 35.6654, lng: 139.7707 }, popular: true,
  },
  {
    id: "tokyo-akihabara",
    tourId: "tokyo",
    name: "Akihabara Electric Town",
    description: "Explore the neon-lit electronics and anime district — multi-story arcades, maid cafes, retro game shops, and the latest gadgets.",
    image: "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=800&q=80",
    price: 2000, duration: "3-4 hours", rating: 4.5, reviews: 534,
    landmarks: ["Akihabara Radio Kaikan", "Yodobashi Camera", "Maid Cafes", "Anime Shops", "Sega Arcade"],
    bestTime: "Afternoon (1 PM - 6 PM, shops open late)", category: "shopping",
    coordinates: { lat: 35.7023, lng: 139.7745 }, popular: true,
  },
  // ────────── VIZAG ──────────
  {
    id: "vizag-rk-beach",
    tourId: "vizag",
    name: "RK Beach & Submarine Museum",
    description: "Relax at the pristine RK Beach, tour the iconic INS Kursura submarine museum, and watch the sunset at the nearby Yarada Beach.",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80",
    price: 200, duration: "3-4 hours", rating: 4.5, reviews: 345,
    landmarks: ["RK Beach", "INS Kursura Submarine", "Yarada Beach", "VUDA Park", "TU 142 Aircraft Museum"],
    bestTime: "Morning (7 AM - 11 AM)", category: "historical",
    coordinates: { lat: 17.7110, lng: 83.2930 }, popular: true,
  },
  {
    id: "vizag-simhachalam",
    tourId: "vizag",
    name: "Simhachalam Temple & Kambalakonda",
    description: "Visit the ancient 11th-century Simhachalam Temple dedicated to Lord Narasimha, then trek through the lush Kambalakonda Wildlife Sanctuary.",
    image: "https://images.unsplash.com/photo-1470071459604-a3a0d0f0a0c9?w=800&q=80",
    price: 300, duration: "4-5 hours", rating: 4.6, reviews: 234,
    landmarks: ["Simhachalam Temple", "Kambalakonda Sanctuary", "Viewpoint", "Nature Trail"],
    bestTime: "Morning (8 AM - 1 PM)", category: "spiritual",
    coordinates: { lat: 17.7670, lng: 83.3190 }, popular: true,
  },
  {
    id: "vizag-borra",
    tourId: "vizag",
    name: "Borra Caves & Araku Day Trip",
    description: "Drive through scenic Eastern Ghats to explore the million-year-old Borra Caves and the coffee plantations of Araku Valley.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    price: 1500, duration: "Full Day (8 AM - 5 PM)", rating: 4.7, reviews: 198,
    landmarks: ["Borra Caves", "Araku Valley", "Coffee Plantations", "Tribal Museum"],
    bestTime: "Early Morning (7 AM start)", category: "nature",
    coordinates: { lat: 18.2810, lng: 83.0820 }, popular: true,
  },

];

export const getShortTripsByTourId = (tourId: string): ShortTrip[] => {
  return shortTrips.filter((trip) => trip.tourId === tourId);
};

export const getPopularTripsByTourId = (tourId: string): ShortTrip[] => {
  return shortTrips.filter((trip) => trip.tourId === tourId && trip.popular);
};

export const getShortTripsByCategory = (category: ShortTrip["category"]): ShortTrip[] => {
  return shortTrips.filter((trip) => trip.category === category);
};

export const shortTripCategories: { id: ShortTrip["category"]; label: string; icon: string }[] = [
  { id: "historical", label: "Historical", icon: "🏛️" },
  { id: "nature", label: "Nature", icon: "🌿" },
  { id: "spiritual", label: "Spiritual", icon: "🕉️" },
  { id: "adventure", label: "Adventure", icon: "🧗" },
  { id: "cultural", label: "Cultural", icon: "🎭" },
  { id: "food", label: "Food & Drink", icon: "🍽️" },
  { id: "shopping", label: "Shopping", icon: "🛍️" },
  { id: "wildlife", label: "Wildlife", icon: "🐅" },
  { id: "romantic", label: "Romantic", icon: "💕" },
];
