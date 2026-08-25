export type PropertyStatus = "Available" | "Reserved" | "Occupied";

export type Property = {
  id: string;
  title: string;
  apartmentName: string;
  description: string;
  rent: number;
  deposit: number;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  propertyType: string;
  amenities: string[];
  images: string[];
  videoTour: string;
  location: string;
  neighborhood: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  availability: string;
  datePosted: string;
  landlord: {
    name: string;
    rating: number;
    phone: string;
    whatsapp: string;
    verified: boolean;
  };
  status: PropertyStatus;
  featured?: boolean;
  views: number;
  savedCount: number;
};

export const properties: Property[] = [
  {
    id: "kilimani-01",
    title: "Bright 2 Bedroom Apartment",
    apartmentName: "Azure Court",
    description: "A secure apartment with natural light, fiber internet, balcony views, and fast access to Yaya Centre.",
    rent: 78000,
    deposit: 78000,
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 940,
    propertyType: "Apartment",
    amenities: ["Parking", "Wi-Fi", "Backup power", "Balcony", "CCTV"],
    images: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=85"
    ],
    videoTour: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1400&q=85",
    location: "Kilimani, Nairobi",
    neighborhood: "Kilimani",
    coordinates: { lat: -1.2921, lng: 36.7819 },
    availability: "Available now",
    datePosted: "2026-06-12",
    landlord: {
      name: "Mercy Wanjiku",
      rating: 4.8,
      phone: "+254712345678",
      whatsapp: "https://wa.me/254712345678",
      verified: true
    },
    status: "Available",
    featured: true,
    views: 1840,
    savedCount: 126
  },
  {
    id: "westlands-01",
    title: "Executive Studio Near Sarit",
    apartmentName: "Sarit Grove",
    description: "Compact premium studio with fitted kitchen, rooftop lounge, and walkable access to Westlands offices.",
    rent: 52000,
    deposit: 52000,
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: 520,
    propertyType: "Studio",
    amenities: ["Lift", "Gym", "Rooftop", "Security", "Water storage"],
    images: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1400&q=85"
    ],
    videoTour: "https://images.unsplash.com/photo-1617103996702-96ff29b1c467?auto=format&fit=crop&w=1400&q=85",
    location: "Westlands, Nairobi",
    neighborhood: "Westlands",
    coordinates: { lat: -1.2634, lng: 36.8024 },
    availability: "From 2026-06-20",
    datePosted: "2026-06-11",
    landlord: {
      name: "Hassan Ali",
      rating: 4.6,
      phone: "+254733987654",
      whatsapp: "https://wa.me/254733987654",
      verified: true
    },
    status: "Reserved",
    featured: true,
    views: 1220,
    savedCount: 88
  },
  {
    id: "ruaka-01",
    title: "Family Maisonette With Garden",
    apartmentName: "Ridge Villas",
    description: "Three bedroom maisonette with private garden, DSQ, pet-friendly policy, and two parking bays.",
    rent: 135000,
    deposit: 135000,
    bedrooms: 3,
    bathrooms: 3,
    squareFeet: 1680,
    propertyType: "Maisonette",
    amenities: ["Garden", "DSQ", "Pet friendly", "Parking", "Solar water"],
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1400&q=85"
    ],
    videoTour: "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1400&q=85",
    location: "Ruaka, Kiambu",
    neighborhood: "Ruaka",
    coordinates: { lat: -1.1991, lng: 36.7698 },
    availability: "Available now",
    datePosted: "2026-06-10",
    landlord: {
      name: "Grace Muthoni",
      rating: 4.9,
      phone: "+254701555888",
      whatsapp: "https://wa.me/254701555888",
      verified: true
    },
    status: "Available",
    featured: true,
    views: 2180,
    savedCount: 203
  },
  {
    id: "thindigua-01",
    title: "Modern 1 Bedroom With Study",
    apartmentName: "Palm Heights",
    description: "Newly finished one bedroom with a quiet study nook, open kitchen, and fast route to Kiambu Road.",
    rent: 42000,
    deposit: 42000,
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: 610,
    propertyType: "Apartment",
    amenities: ["Study nook", "Parking", "CCTV", "Borehole", "Balcony"],
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1560184897-ae75f418493e?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1400&q=85"
    ],
    videoTour: "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&w=1400&q=85",
    location: "Thindigua, Kiambu",
    neighborhood: "Thindigua",
    coordinates: { lat: -1.1998, lng: 36.8386 },
    availability: "Available now",
    datePosted: "2026-06-09",
    landlord: {
      name: "Brian Otieno",
      rating: 4.5,
      phone: "+254722111444",
      whatsapp: "https://wa.me/254722111444",
      verified: true
    },
    status: "Available",
    views: 890,
    savedCount: 61
  },
  {
    id: "kileleshwa-01",
    title: "Serviced 2 Bedroom With Pool",
    apartmentName: "Cedar Residences",
    description: "Fully serviced home with housekeeping options, heated pool, gym, and responsive property management.",
    rent: 115000,
    deposit: 115000,
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 1180,
    propertyType: "Serviced Apartment",
    amenities: ["Pool", "Gym", "Housekeeping", "Backup power", "Lift"],
    images: [
      "https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1616137466211-f939a420be84?auto=format&fit=crop&w=1400&q=85"
    ],
    videoTour: "https://images.unsplash.com/photo-1600607687644-c7171b42498b?auto=format&fit=crop&w=1400&q=85",
    location: "Kileleshwa, Nairobi",
    neighborhood: "Kileleshwa",
    coordinates: { lat: -1.2833, lng: 36.7823 },
    availability: "From 2026-06-25",
    datePosted: "2026-06-08",
    landlord: {
      name: "Amina Hassan",
      rating: 4.7,
      phone: "+254745777333",
      whatsapp: "https://wa.me/254745777333",
      verified: true
    },
    status: "Available",
    featured: true,
    views: 1430,
    savedCount: 97
  },
  {
    id: "ngong-01",
    title: "Affordable Bedsitter Near Stage",
    apartmentName: "Milele Flats",
    description: "Budget-friendly bedsitter with reliable water, token electricity, and public transport within two minutes.",
    rent: 14000,
    deposit: 14000,
    bedrooms: 0,
    bathrooms: 1,
    squareFeet: 280,
    propertyType: "Bedsitter",
    amenities: ["Water storage", "Token meter", "Security", "Close to transport"],
    images: [
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=85",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1400&q=85"
    ],
    videoTour: "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?auto=format&fit=crop&w=1400&q=85",
    location: "Ngong, Kajiado",
    neighborhood: "Ngong",
    coordinates: { lat: -1.3618, lng: 36.6566 },
    availability: "Available now",
    datePosted: "2026-06-07",
    landlord: {
      name: "Peter Kamau",
      rating: 4.3,
      phone: "+254799222111",
      whatsapp: "https://wa.me/254799222111",
      verified: true
    },
    status: "Available",
    views: 640,
    savedCount: 49
  }
];

export const subscriptionPlans = [
  {
    id: "basic",
    name: "Basic",
    price: 1200,
    period: "30 Days",
    maxProperties: "Up to 5 properties",
    features: ["Listing analytics", "In-app inquiries", "SMS expiry reminders"]
  },
  {
    id: "standard",
    name: "Standard",
    price: 3200,
    period: "30 Days",
    maxProperties: "Up to 20 properties",
    features: ["Featured listings", "Lead tracking", "Priority approval queue"],
    highlighted: true
  },
  {
    id: "premium",
    name: "Premium",
    price: 6900,
    period: "30 Days",
    maxProperties: "Unlimited listings",
    features: ["Featured badge", "Priority visibility", "Portfolio analytics"]
  }
];

export const popularLocations = [
  {
    name: "Kilimani",
    count: 128,
    image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Westlands",
    count: 94,
    image: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Ruaka",
    count: 71,
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=900&q=80"
  },
  {
    name: "Thindigua",
    count: 56,
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=900&q=80"
  }
];

export const testimonials = [
  {
    name: "Linda M.",
    role: "Tenant",
    quote: "I booked two viewings in one afternoon and moved into a verified apartment the next week.",
    rating: 5
  },
  {
    name: "Samuel K.",
    role: "Landlord",
    quote: "The subscription gate keeps inquiries serious, and the analytics show exactly which listings need updates.",
    rating: 5
  },
  {
    name: "Nadia A.",
    role: "Tenant",
    quote: "Saved searches and WhatsApp contact made my house hunt feel organized instead of stressful.",
    rating: 5
  }
];

export const faqs = [
  {
    question: "Can landlords publish before paying?",
    answer: "No. Landlords must verify their phone number, choose a plan, and complete payment before property creation is enabled."
  },
  {
    question: "How are fake listings handled?",
    answer: "Tenants can report listings, admins can suspend or reject them, and landlord reviews are attached to verified accounts."
  },
  {
    question: "Which payments are supported?",
    answer: "The platform is structured for M-Pesa, card payments, bank payments, and mobile money provider integrations."
  },
  {
    question: "Can tenants schedule viewings?",
    answer: "Yes. Tenants can request viewing times, receive reminders, and track application history from their dashboard."
  }
];

export const dashboardMetrics = {
  tenant: [
    { label: "Saved houses", value: "12" },
    { label: "Viewings", value: "4" },
    { label: "Applications", value: "3" },
    { label: "Alerts", value: "8" }
  ],
  landlord: [
    { label: "Views", value: "18.4K" },
    { label: "Saved count", value: "632" },
    { label: "Leads", value: "119" },
    { label: "Occupancy", value: "86%" }
  ],
  admin: [
    { label: "Users", value: "42.8K" },
    { label: "Listings", value: "8,420" },
    { label: "Income", value: "KES 12.4M" },
    { label: "Reports", value: "37" }
  ]
};
