export interface FoodSpot {
  id: string;
  tourId: string;
  name: string;
  description: string;
  image: string;
  priceRange: string;
  rating: number;
  reviews: number;
  cuisine: string[];
  signatureDish: string;
  mustTry: string[];
  coordinates: { lat: number; lng: number };
  bestFor: string;
  type: "restaurant" | "street-food" | "cafe" | "fine-dining" | "local-specialty";
  popular: boolean;
}

export const foodSpots: FoodSpot[] = [
  // ────────── MANALI ──────────
  {
    id: "manali-johnson",
    tourId: "manali",
    name: "Johnson's Cafe",
    description: "Riverside cafe with wood-fired pizzas, trout dishes, and stunning mountain views — a Manali institution since 1996.",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",
    priceRange: "₹500-1,000", rating: 4.6, reviews: 876,
    cuisine: ["Continental", "Himachali", "Italian"],
    signatureDish: "Grilled Trout with Lemon Butter",
    mustTry: ["Wood-fired Pizza", "Apple Crumble", "Himachali Dham Thali"],
    coordinates: { lat: 32.2430, lng: 77.1890 },
    bestFor: "Dinner with river views", type: "restaurant", popular: true,
  },
  {
    id: "manali-dylan",
    tourId: "manali",
    name: "Dylan's Toasted & Roasted",
    description: "Cozy cafe serving the best coffee in Manali with homemade pastries, bagels, and live acoustic music evenings.",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80",
    priceRange: "₹300-600", rating: 4.5, reviews: 534,
    cuisine: ["Cafe", "Bakery", "Continental"],
    signatureDish: "Himalayan Honey Latte",
    mustTry: ["Avocado Toast", "Bagel with Cream Cheese", "Brownie Sundae"],
    coordinates: { lat: 32.2420, lng: 77.1910 },
    bestFor: "Breakfast & coffee", type: "cafe", popular: false,
  },
  {
    id: "manali-momos",
    tourId: "manali",
    name: "Old Manali Momo Stalls",
    description: "Street-side momo stalls in Old Manali serving steaming Tibetan momos with spicy red chutney — a must-try local experience.",
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&q=80",
    priceRange: "₹50-200", rating: 4.4, reviews: 345,
    cuisine: ["Tibetan", "Street Food"],
    signatureDish: "Steamed Chicken Momos",
    mustTry: ["Fried Momos", "Thukpa Noodle Soup", "Butter Tea"],
    coordinates: { lat: 32.2480, lng: 77.1960 },
    bestFor: "Quick & authentic street food", type: "street-food", popular: true,
  },

  // ────────── GOA ──────────
  {
    id: "goa-gunpowder",
    tourId: "goa",
    name: "Gunpowder",
    description: "Award-winning South Indian restaurant in Assagao serving incredible Kerala and Goan dishes in a garden setting.",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80",
    priceRange: "₹800-1,500", rating: 4.7, reviews: 678,
    cuisine: ["Kerala", "Goan", "South Indian"],
    signatureDish: "Pork Vindaloo with Sol Kadhi",
    mustTry: ["Appam with Stew", "Goan Fish Curry", "Beef Croquettes", "Prawn Balchao"],
    coordinates: { lat: 15.5670, lng: 73.7840 },
    bestFor: "Authentic Goan-Kerala fusion", type: "restaurant", popular: true,
  },
  {
    id: "goa-britto",
    tourId: "goa",
    name: "Britto's Bar & Restaurant",
    description: "Iconic beach shack on Baga Beach serving seafood, cold beer, and Goan specialties right on the sand since 1975.",
    image: "https://images.unsplash.com/photo-1555126634-323283e090fa?w=800&q=80",
    priceRange: "₹600-1,200", rating: 4.5, reviews: 987,
    cuisine: ["Goan", "Seafood", "Continental"],
    signatureDish: "Goan Fish Curry Rice",
    mustTry: ["Chilli Crab", "Prawn Curry", "King's Beer", "Bebinca Dessert"],
    coordinates: { lat: 15.5590, lng: 73.7520 },
    bestFor: "Beachfront dinner & sunset", type: "restaurant", popular: true,
  },
  {
    id: "goa-mackies",
    tourId: "goa",
    name: "Mackie's Saturday Night Bazaar",
    description: "Famous night market with live music, global food stalls, flea market shopping, and an electric party atmosphere every Saturday.",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80",
    priceRange: "₹300-800", rating: 4.3, reviews: 456,
    cuisine: ["Multi-cuisine", "Street Food", "Goan"],
    signatureDish: "Prawn Ghee Roast",
    mustTry: ["BBQ Ribs", "Feni Sour Cocktail", "Seafood Platter", "Dosas"],
    coordinates: { lat: 15.5810, lng: 73.7420 },
    bestFor: "Night market experience", type: "street-food", popular: false,
  },

  // ────────── HYDERABAD ──────────
  {
    id: "hyd-paradise",
    tourId: "hyderabad",
    name: "Paradise Biryani",
    description: "Legendary restaurant serving Hyderabad's famous dum biryani since 1953 — a pilgrimage for food lovers visiting the city.",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&q=80",
    priceRange: "₹400-800", rating: 4.6, reviews: 2345,
    cuisine: ["Hyderabadi", "Mughlai", "Indian"],
    signatureDish: "Chicken Dum Biryani",
    mustTry: ["Mutton Biryani", "Haleem (Ramadan)", "Double Ka Meetha", "Irani Chai"],
    coordinates: { lat: 17.4450, lng: 78.4500 },
    bestFor: "The iconic Hyderabadi experience", type: "restaurant", popular: true,
  },
  {
    id: "hyd-nihari",
    tourId: "hyderabad",
    name: "Hotel Shadab",
    description: "Old Hyderabad institution in the heart of the old city, famous for its slow-cooked nihari and haleem near Charminar.",
    image: "https://images.unsplash.com/photo-1505253758473-96b7015fcd40?w=800&q=80",
    priceRange: "₹300-600", rating: 4.5, reviews: 1567,
    cuisine: ["Hyderabadi", "Mughlai"],
    signatureDish: "Nihari with Sheermal",
    mustTry: ["Haleem", "Mutton Pasinda", "Chicken 65", "Lukhmi"],
    coordinates: { lat: 17.3610, lng: 78.4760 },
    bestFor: "Old city biryani & nihari", type: "restaurant", popular: true,
  },
  {
    id: "hyd-irani-chai",
    tourId: "hyderabad",
    name: "Tea Time at Nimrah Cafe",
    description: "Iconic Irani cafe under the Charminar arches — sip sweet Irani chai with Osmania biscuits while gazing at the 1591 monument.",
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800&q=80",
    priceRange: "₹20-100", rating: 4.3, reviews: 890,
    cuisine: ["Irani", "Tea"],
    signatureDish: "Irani Chai & Osmania Biscuit",
    mustTry: ["Bun Maska", "Kheer", "Mango Milkshake (summer)"],
    coordinates: { lat: 17.3616, lng: 78.4745 },
    bestFor: "Afternoon tea break", type: "street-food", popular: true,
  },

  // ────────── MUNNAR ──────────
  {
    id: "munnar-silver",
    tourId: "munnar",
    name: "Silver Spoon Restaurant",
    description: "Top-rated restaurant in Munnar serving authentic Kerala meals with panoramic views of tea plantations.",
    image: "https://images.unsplash.com/photo-1559650656-5d1d361ad10e?w=800&q=80",
    priceRange: "₹400-800", rating: 4.5, reviews: 456,
    cuisine: ["Kerala", "South Indian", "Chinese"],
    signatureDish: "Kerala Sadya (Banana Leaf Meal)",
    mustTry: ["Appam with Stew", "Malabar Parotta with Beef Fry", "Prawn Mango Curry"],
    coordinates: { lat: 10.0900, lng: 77.0600 },
    bestFor: "Traditional Kerala lunch", type: "restaurant", popular: true,
  },

  // ────────── BALI ──────────
  {
    id: "bali-locavore",
    tourId: "bali",
    name: "Locavore Bali",
    description: "Ranked among Asia's best restaurants — a farm-to-table fine dining experience featuring modern Indonesian cuisine with local ingredients.",
    image: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=800&q=80",
    priceRange: "₹7,000-10,000", rating: 4.9, reviews: 567,
    cuisine: ["Modern Indonesian", "Fusion"],
    signatureDish: "15-Course Tasting Menu with Kokosan Pairings",
    mustTry: ["Nasi Goreng", "Babi Guling", "Sate Lilit", "Dadar Gulung"],
    coordinates: { lat: -8.5200, lng: 115.2610 },
    bestFor: "World-class fine dining", type: "fine-dining", popular: true,
  },
  {
    id: "bali-babi-guling",
    tourId: "bali",
    name: "Warung Babi Guling Ibu Oka",
    description: "Ubud's most famous warung serving Bali's signature dish — suckling pig with crispy skin, slow-roasted with traditional spices.",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",
    priceRange: "₹300-600", rating: 4.5, reviews: 1234,
    cuisine: ["Balinese", "Indonesian"],
    signatureDish: "Babi Guling (Suckling Pig)",
    mustTry: ["Nasi Campur", "Lawar", "Sate Lilit", "Jajan Pasar"],
    coordinates: { lat: -8.5080, lng: 115.2630 },
    bestFor: "Authentic Balinese feast", type: "local-specialty", popular: true,
  },

  // ────────── TOKYO ──────────
  {
    id: "tokyo-sukiyabashi",
    tourId: "tokyo",
    name: "Sukiyabashi Jiro",
    description: "World-famous 3-Michelin-star sushi restaurant in Ginza — the legendary Jiro Ono's sushi temple, featured in 'Jiro Dreams of Sushi'.",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80",
    priceRange: "¥40,000+", rating: 4.9, reviews: 234,
    cuisine: ["Sushi", "Japanese"],
    signatureDish: "Omakase (Chef's Selection of 20 pieces)",
    mustTry: ["Toro (Fatty Tuna)", "Uni (Sea Urchin)", "Anago (Eel)", "Tamagoyaki"],
    coordinates: { lat: 35.6730, lng: 139.7640 },
    bestFor: "Once-in-a-lifetime sushi experience", type: "fine-dining", popular: true,
  },
  {
    id: "tokyo-ramen",
    tourId: "tokyo",
    name: "Ichiran Ramen Shinjuku",
    description: "The ultimate solo ramen experience — choose your broth richness, noodle firmness, and spice level in a private booth.",
    image: "https://images.unsplash.com/photo-1557872943-16a5ac26437e?w=800&q=80",
    priceRange: "¥1,000-2,000", rating: 4.6, reviews: 3456,
    cuisine: ["Ramen", "Japanese"],
    signatureDish: "Tonkotsu Ramen with Extra Pork Belly",
    mustTry: ["Seasoned Egg", "Karaage", "Matcha Pudding", "Sake"],
    coordinates: { lat: 35.6900, lng: 139.7020 },
    bestFor: "Authentic Tokyo ramen", type: "restaurant", popular: true,
  },
  {
    id: "tokyo-tsukiji-sushi",
    tourId: "tokyo",
    name: "Tsukiji Outer Market Street Food",
    description: "Wander the bustling outer market stalls — fresh sushi, grilled scallops, tamagoyaki, matcha soft serve, and seafood galore.",
    image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&q=80",
    priceRange: "¥500-3,000", rating: 4.7, reviews: 4567,
    cuisine: ["Japanese", "Street Food", "Seafood"],
    signatureDish: "Kaisendon (Seafood Rice Bowl)",
    mustTry: ["Grilled Scallops", "Tamagoyaki", "Matcha Ice Cream", "Amaebi (Sweet Shrimp)"],
    coordinates: { lat: 35.6650, lng: 139.7710 },
    bestFor: "Street food & sushi breakfast", type: "street-food", popular: true,
  },

  // ────────── SANTORINI ──────────
  {
    id: "santorini-metaxi",
    tourId: "santorini",
    name: "Metaxi Mas",
    description: "Hidden gem in Exo Gonia serving incredible traditional Greek dishes with a modern twist — local favorite, few tourists.",
    image: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=800&q=80",
    priceRange: "€25-45", rating: 4.8, reviews: 678,
    cuisine: ["Greek", "Mediterranean"],
    signatureDish: "Lamb Kleftiko with Santorini Fava",
    mustTry: ["Tomato Keftedes", "Fava with Capers", "Grilled Octopus", "Baklava"],
    coordinates: { lat: 36.3910, lng: 25.4360 },
    bestFor: "Authentic Greek dinner", type: "restaurant", popular: true,
  },
  {
    id: "santorini-amoudi",
    tourId: "santorini",
    name: "Sunset Dining at Amoudi Bay",
    description: "Fresh seafood tavernas right on the water at the bottom of Oia's cliff — watch the sunset while eating grilled fish with your feet in the sand.",
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&q=80",
    priceRange: "€30-60", rating: 4.7, reviews: 890,
    cuisine: ["Greek", "Seafood", "Mediterranean"],
    signatureDish: "Grilled Fresh Catch with Lemon & Oregano",
    mustTry: ["Lobster Pasta", "Grilled Octopus", "Fava Dip", "Ouzo"],
    coordinates: { lat: 36.4620, lng: 25.3730 },
    bestFor: "Romantic sunset seafood", type: "fine-dining", popular: true,
  },

  // ────────── DUBAI ──────────
  {
    id: "dubai-zuma",
    tourId: "dubai",
    name: "Zuma Dubai",
    description: "Award-winning contemporary Japanese restaurant in DIFC — one of Dubai's most sophisticated dining experiences with incredible robata grill.",
    image: "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=800&q=80",
    priceRange: "AED 400-700", rating: 4.7, reviews: 1234,
    cuisine: ["Japanese", "Contemporary"],
    signatureDish: "Black Cod Miso",
    mustTry: ["Wagyu Beef Sando", "Crispy Rice with Tuna", "Spicy Tuna Rolls", "Matcha Tiramisu"],
    coordinates: { lat: 25.2080, lng: 55.2790 },
    bestFor: "High-end Japanese dining", type: "fine-dining", popular: true,
  },
  {
    id: "dubai-al-falamaki",
    tourId: "dubai",
    name: "Al Falamanki",
    description: "Charming Lebanese restaurant with a beautiful garden terrace — serves the best hummus, grilled meats, and Arabic mezzes in the city.",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80",
    priceRange: "AED 150-300", rating: 4.5, reviews: 876,
    cuisine: ["Lebanese", "Arabic", "Middle Eastern"],
    signatureDish: "Mixed Grill Platter with Fresh Hummus",
    mustTry: ["Fattoush Salad", "Stuffed Grape Leaves", "Shawarma", "Kunafa"],
    coordinates: { lat: 25.2280, lng: 55.2580 },
    bestFor: "Arabic feast in garden setting", type: "restaurant", popular: true,
  },

  // ────────── PHUKET ──────────
  {
    id: "phuket-ruk",
    tourId: "phuket",
    name: "Raya Restaurant",
    description: "Classic Phuketian restaurant in a charming Sino-Thai mansion — the most authentic Southern Thai food on the island.",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80",
    priceRange: "฿300-600", rating: 4.6, reviews: 567,
    cuisine: ["Southern Thai", "Phuketian"],
    signatureDish: "Crab Curry with Betel Leaves",
    mustTry: ["Moo Hong (Braised Pork)", "Tom Yum Goong", "Phuket Noodles", "Mango Sticky Rice"],
    coordinates: { lat: 7.8830, lng: 98.3900 },
    bestFor: "Authentic Phuketian cuisine", type: "restaurant", popular: true,
  },

  // ────────── KERALA ──────────
  {
    id: "kerala-kashi",
    tourId: "kerala",
    name: "Kashi Art Cafe",
    description: "Trendy art cafe in Fort Kochi — great coffee, sandwiches, and art gallery vibes in a restored colonial building.",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80",
    priceRange: "₹300-600", rating: 4.5, reviews: 678,
    cuisine: ["Continental", "Cafe", "Kerala"],
    signatureDish: "Artisan Coffee with Banana Cake",
    mustTry: ["Grilled Sandwich", "Quiche", "Kerala Tea", "Smoothie Bowls"],
    coordinates: { lat: 9.9660, lng: 76.2430 },
    bestFor: "Coffee & art in Fort Kochi", type: "cafe", popular: true,
  },
  {
    id: "kerala-seafood",
    tourId: "kerala",
    name: "Fort Kochi Seafood Street",
    description: "Evening seafood street by the Chinese Fishing Nets — choose your fresh catch, get it grilled with Kerala spices, and eat by the waterfront.",
    image: "https://images.unsplash.com/photo-1593693397690-362cb9666fc3?w=800&q=80",
    priceRange: "₹400-800", rating: 4.6, reviews: 890,
    cuisine: ["Kerala", "Seafood"],
    signatureDish: "Fresh Catch Grilled with Kerala Masala",
    mustTry: ["Pearl Spot Fry", "Prawn Roast", "Squid Chilli", "Kerala Parotta"],
    coordinates: { lat: 9.9650, lng: 76.2440 },
    bestFor: "Waterfront seafood dinner", type: "street-food", popular: true,
  },
  // ────────── VIZAG ──────────
  {
    id: "vizag-dolphin",
    tourId: "vizag",
    name: "Dolphin Hotel Restaurant",
    description: "Legendary Andhra-style meals served on banana leaves — authentic Andhra thali with spicy curries, ghee rice, and tangy pickles.",
    image: "https://images.unsplash.com/photo-1555126634-323283e090fa?w=800&q=80",
    priceRange: "₹300-600", rating: 4.5, reviews: 678,
    cuisine: ["Andhra", "South Indian"],
    signatureDish: "Andhra Chicken Thali",
    mustTry: ["Gongura Pickle", "Bamboo Chicken", "Pesarattu", "Mango Dal"],
    coordinates: { lat: 17.7110, lng: 83.2940 },
    bestFor: "Authentic Andhra lunch", type: "restaurant", popular: true,
  },
  {
    id: "vizag-waltair",
    tourId: "vizag",
    name: "Waltair Club",
    description: "Heritage club with sea views serving continental and Indian cuisine — the perfect spot for a relaxed evening by the Bay of Bengal.",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",
    priceRange: "₹500-1,000", rating: 4.3, reviews: 345,
    cuisine: ["Continental", "Indian", "Seafood"],
    signatureDish: "Andhra Chilli Chicken",
    mustTry: ["Prawn Fry", "Mutton Biryani", "Pani Puri", "Filter Coffee"],
    coordinates: { lat: 17.7180, lng: 83.3080 },
    bestFor: "Sunset dining with sea view", type: "fine-dining", popular: false,
  },
];

export const getFoodByTourId = (tourId: string): FoodSpot[] => {
  return foodSpots.filter((f) => f.tourId === tourId);
};

export const getPopularFoodByTourId = (tourId: string): FoodSpot[] => {
  return foodSpots.filter((f) => f.tourId === tourId && f.popular);
};

export const foodTypes: { id: FoodSpot["type"]; label: string }[] = [
  { id: "restaurant", label: "Restaurant" },
  { id: "street-food", label: "Street Food" },
  { id: "cafe", label: "Cafe" },
  { id: "fine-dining", label: "Fine Dining" },
  { id: "local-specialty", label: "Local Specialty" },
];
