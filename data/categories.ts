import toteBagImg from "@/public/hemp-bag-1.jpg";
import backpackImg from "@/public/hemp-bag-2.jpg";
import shoulderBagImg from "@/public/hemp-bag-3.jpg";
import clutchImg from "@/public/artisan-hands.jpg";

export const categories = [
  {
    slug: "tote-bags",
    name: "Tote Bags",
    hero: {
      title: "Spacious & Stylish",
      subtitle: "Spacious everyday carriers handcrafted for modern life.",
      badge: "Tote Bags Collection",
      image: toteBagImg,
    },
    products: [
      {
        id: 1,
        name: "Classic Tote",
        price: 50,
        rating: 4.7,
        reviews: 120,
        image: toteBagImg,
      },
      {
        id: 2,
        name: "Eco Tote",
        price: 55,
        rating: 4.8,
        reviews: 95,
        image: backpackImg,
      },
    ],
  },
  {
    slug: "backpacks",
    name: "Backpacks",
    hero: {
      title: "Adventure-Ready",
      subtitle: "Backpacks designed for travel, work, and everyday adventures.",
      badge: "Backpacks Collection",
      image: backpackImg,
    },
    products: [
      {
        id: 3,
        name: "City Backpack",
        price: 60,
        rating: 4.6,
        reviews: 110,
        image: "/placeholder.svg",
      },
      {
        id: 4,
        name: "Travel Backpack",
        price: 75,
        rating: 4.9,
        reviews: 80,
        image: "/placeholder.svg",
      },
    ],
  },
  {
    slug: "shoulder-bags",
    name: "Shoulder Bags",
    hero: {
      title: "Elegant & Functional",
      subtitle:
        "Sophisticated shoulder bags that transition seamlessly from day to evening.",
      badge: "Shoulder Bags Collection",
      image: shoulderBagImg,
    },
    products: [
      {
        id: 13,
        name: "Classic Crossbody",
        price: 62,
        rating: 4.8,
        reviews: 142,
        image: "/placeholder.svg",
        tag: "Bestseller",
      },
      {
        id: 14,
        name: "Evening Elegance Bag",
        price: 75,
        rating: 4.9,
        reviews: 98,
        image: "/placeholder.svg",
        tag: "Premium",
      },
    ],
  },
  {
    slug: "clutches",
    name: "Clutches",
    hero: {
      title: "Perfect for Every Occasion",
      subtitle: "Clutches designed for evening elegance and special moments.",
      badge: "Clutches Collection",
      image: clutchImg,
    },
    products: [
      {
        id: 20,
        name: "Envelope Clutch",
        price: 45,
        rating: 4.8,
        reviews: 90,
        image: "/placeholder.svg",
      },
      {
        id: 21,
        name: "Fold-over Clutch",
        price: 50,
        rating: 4.9,
        reviews: 75,
        image: "/placeholder.svg",
      },
    ],
  },
];
