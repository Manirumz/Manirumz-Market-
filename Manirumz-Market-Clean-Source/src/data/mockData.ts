import { Product, Store, User, Order } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "p1",
    sellerId: "seller1",
    sellerName: "Manirumz Tech Hub",
    title: "Samsung Galaxy S24 Ultra (512GB) - Pi Edition",
    titleHa: "Samsung Galaxy S24 Ultra (512GB) - Samfurin Pi",
    description: "Brand new Galaxy S24 Ultra with AI Camera, Snapdragon 8 Gen 3, and 5000mAh battery. Fully unlocked for global Pi pioneers.",
    descriptionHa: "Sabuwace cak ta Galaxy S24 Ultra da kamara mai fasaha (AI), da baturi mai karfi 5000mAh. An bude ta don kowa ya yi amfani da Pi.",
    pricePi: 2.50,
    priceUsd: 1199.00,
    category: "phones",
    stock: 15,
    imageUrl: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    reviewCount: 48,
    isFeatured: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "p2",
    sellerId: "seller2",
    sellerName: "Kano Traditional Crafts & Textiles",
    title: "Authentic Hausa Royal Babban Riga (Hand-Embroidered)",
    titleHa: "Babban Riga Mai Aikin Hannu Irin Na Sarakunan Hausa",
    description: "Premium hand-woven cotton Babban Riga with gold-thread hand embroidery from Northern Nigeria. Includes matching cap and trousers.",
    descriptionHa: "Tufafin Babban Riga mai aikin hannu na zaren zinari daga garin Kano/Katsina. Tareda hula da wando mai kyawun gaske.",
    pricePi: 0.85,
    priceUsd: 250.00,
    category: "fashion",
    stock: 8,
    imageUrl: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80",
    rating: 5.0,
    reviewCount: 32,
    isFeatured: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "p3",
    sellerId: "seller1",
    sellerName: "Manirumz Tech Hub",
    title: "Apple MacBook Pro 16\" M3 Max (36GB RAM)",
    titleHa: "Kwamfutar MacBook Pro 16\" M3 Max da Mantuwa 36GB",
    description: "Ultra-performance laptop for developers, Pi node operators, and creative designers. Space Black finish.",
    descriptionHa: "Kwamfutar tafi-da-gidanka mai saurin gaske don masu rubuta software da masu kula da Pi Node.",
    pricePi: 8.50,
    priceUsd: 3499.00,
    category: "electronics",
    stock: 5,
    imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
    rating: 4.8,
    reviewCount: 19,
    isFeatured: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "p4",
    sellerId: "seller3",
    sellerName: "Arewa Solar & Green Energy",
    title: "3.5kVA Hybrid Solar Inverter + Lithium Battery Kit",
    titleHa: "Ingantaccen Na'urar Solaye (Solar Inverter) da Baturin Lithium",
    description: "Power your house or business 24/7 with 3.5kVA pure sine wave inverter, 100Ah lithium battery, and 4x 450W solar panels.",
    descriptionHa: "Umarcin wutar lantarki ta hanyar rana (solaye) don gida ko shago sa'o'i 24 cikin 24 ba tare da katsewa ba.",
    pricePi: 3.20,
    priceUsd: 1450.00,
    category: "electronics",
    stock: 12,
    imageUrl: "https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    reviewCount: 64,
    isFeatured: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "p5",
    sellerId: "seller4",
    sellerName: "Manirumz Agro-Allied Produce",
    title: "Organic Nigerian Ginger & Sesame Seeds (25kg Export Bag)",
    titleHa: "Jakar Citta da Ridi ta Asali na Karkara (Kilo 25)",
    description: "100% natural sun-dried ginger and Grade-A sesame seeds sourced directly from Kaduna & Kano farmers. Shipped globally for Pi.",
    descriptionHa: "Citta mai yaji da ridi masu inganci a goya daga gonakin Arewa. Ana tura duka duniya a biya da Pi.",
    pricePi: 0.25,
    priceUsd: 80.00,
    category: "groceries",
    stock: 50,
    imageUrl: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80",
    rating: 4.7,
    reviewCount: 28,
    isFeatured: false,
    createdAt: new Date().toISOString()
  },
  {
    id: "p6",
    sellerId: "seller1",
    sellerName: "Manirumz Tech Hub",
    title: "Pi Node Specialized Mini PC (Intel i7, 32GB, 1TB SSD)",
    titleHa: "Karamin Kwamfuta Na Musamman Don Aikin Pi Node",
    description: "Pre-configured Pi Node server running 24/7 Linux OS with Docker, fixed port forwarding, and ultra-low 15W power consumption.",
    descriptionHa: "Kwamfutar saurin Pi Node tare da rigakafin wuta da fasahar Linux wanda ya rigaya an saita shi don ba ka babban Pi reward.",
    pricePi: 1.10,
    priceUsd: 450.00,
    category: "electronics",
    stock: 20,
    imageUrl: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80",
    rating: 5.0,
    reviewCount: 89,
    isFeatured: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "p7",
    sellerId: "seller2",
    sellerName: "Kano Traditional Crafts & Textiles",
    title: "Hand-Crafted Genuine Leather Shoes & Boots (Northern Heritage)",
    titleHa: "Takatakan Fatar Dabbobi na Gaskiya Irin Na Kano",
    description: "Durable handmade leather footwear crafted by master artisans in Kofar Wambai leather market.",
    descriptionHa: "Kyawawan takalma da akawu na fatar sa da akwaku masu karsashi da kwazazzabo daga garin Kano.",
    pricePi: 0.20,
    priceUsd: 65.00,
    category: "fashion",
    stock: 35,
    imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80",
    rating: 4.6,
    reviewCount: 41,
    isFeatured: false,
    createdAt: new Date().toISOString()
  },
  {
    id: "p8",
    sellerId: "seller3",
    sellerName: "Arewa Solar & Green Energy",
    title: "Toyota Hilux 4x4 Double Cab (2022) - Pi Verified Deal",
    titleHa: "Motar Toyota Hilux 4x4 (2022) - Sayayyar Pi Tabbatatta",
    description: "Clean imported 2022 Toyota Hilux pickup truck. Full option, diesel engine, spotless interior. Available for Pi Network purchase.",
    descriptionHa: "Ingantacciyar mota mai karfin gaske ta Hilux 4x4. Ana siyarwa gaba daya a biya da Pi Coin.",
    pricePi: 65.00,
    priceUsd: 28000.00,
    category: "automotive",
    stock: 2,
    imageUrl: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80",
    rating: 5.0,
    reviewCount: 14,
    isFeatured: true,
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_STORES: Store[] = [
  {
    id: "st1",
    sellerId: "seller1",
    sellerName: "Manirumz Tech Hub",
    storeName: "Manirumz Electronics & Pi Hardware",
    description: "Official tech flagship store on Manirumz Market. Laptops, smartphones, solar systems and Pi Node hardware.",
    status: "approved",
    totalSalesPi: 142.50,
    createdAt: new Date().toISOString()
  },
  {
    id: "st2",
    sellerId: "seller2",
    sellerName: "Kano Traditional Crafts & Textiles",
    storeName: "Kano Royal Heritage Emporium",
    description: "Handcrafted Hausa fashion, leatherwork, traditional caps, and royal attire.",
    status: "approved",
    totalSalesPi: 56.80,
    createdAt: new Date().toISOString()
  },
  {
    id: "st3",
    sellerId: "seller3",
    sellerName: "Arewa Solar & Green Energy",
    storeName: "Arewa Green Power Solutions",
    description: "Solar panels, lithium batteries, hybrid inverters and clean energy equipment.",
    status: "approved",
    totalSalesPi: 98.20,
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_USERS: User[] = [
  {
    uid: "admin1",
    email: "bahure1122@gmail.com",
    displayName: "Manirumz Super Admin",
    role: "admin",
    piUsername: "manirumz_admin",
    piWalletAddress: "GBA7PI...MANIRUMZ3141592653589",
    language: "en",
    createdAt: new Date().toISOString()
  },
  {
    uid: "seller1",
    email: "seller@manirumz.com",
    displayName: "Manirumz Tech Hub",
    role: "seller",
    piUsername: "manirumz_seller",
    piWalletAddress: "GBS9PI...SELLERWALLETHUB99",
    language: "ha",
    storeName: "Manirumz Electronics & Pi Hardware",
    storeStatus: "approved",
    createdAt: new Date().toISOString()
  },
  {
    uid: "customer1",
    email: "pioneer@pinetwork.com",
    displayName: "Alhaji Musa Pioneer",
    role: "customer",
    piUsername: "musa_pioneer_pi",
    piWalletAddress: "GDC4PI...PIONEERWALLETMUSA",
    language: "ha",
    address: "No. 45 Zoo Road, Kano State, Nigeria",
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: "ORD-92813",
    customerId: "customer1",
    customerName: "Alhaji Musa Pioneer",
    customerEmail: "pioneer@pinetwork.com",
    sellerId: "seller1",
    items: [
      {
        product: INITIAL_PRODUCTS[0],
        quantity: 1
      }
    ],
    totalPi: 2.50,
    totalUsd: 1199.00,
    status: "shipped",
    paymentMethod: "pi_network",
    piPaymentId: "PI-TX-88392104-CONFIRMED",
    shippingAddress: "No. 45 Zoo Road, Kano State, Nigeria",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString()
  }
];
