import { NextResponse } from 'next/server';

const products = [
  // Low Friction (Habitual Core Groceries)
  {
    id: "g1",
    name: "Amul Taaza Toned Fresh Milk",
    category: "Dairy",
    price: 34,
    image: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/assets/products/sliding_images/jpeg/1c0db977-31ab-4d8e-abf3-d42e4a4b4632.jpg?ts=1706182142",
    tags: ["Daily Need", "Verified Fresh"],
    friction: "Low"
  },
  {
    id: "g2",
    name: "Harvest Gold White Bread",
    category: "Bakery",
    price: 40,
    image: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/assets/products/sliding_images/jpeg/952de3ec-8868-45be-8924-f17e0be8adfc.jpg?ts=1707312315",
    tags: ["Daily Need", "Baked Today"],
    friction: "Low"
  },
  // High Friction / High Value Categories (Electronics, Beauty)
  {
    id: "e1",
    name: "Apple iPhone 15 (128GB)",
    category: "Electronics",
    price: 74900,
    image: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/528343a.jpg?ts=1695279669",
    tags: ["Blinkit Certified", "Authentic Guarantee", "10-Min Return"],
    friction: "High"
  },
  {
    id: "b1",
    name: "L'Oreal Paris Hyaluronic Acid Serum",
    category: "Beauty",
    price: 899,
    image: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/488796a.jpg?ts=1690815152",
    tags: ["100% Genuine", "Sealed Packaging"],
    friction: "High"
  },
  {
    id: "e2",
    name: "Boat Airdopes 141",
    category: "Electronics",
    price: 1299,
    image: "https://cdn.grofers.com/cdn-cgi/image/f=auto,fit=scale-down,q=70,metadata=none,w=270/app/images/products/sliding_image/514936a.jpg?ts=1687326466",
    tags: ["Blinkit Certified", "Authentic Guarantee"],
    friction: "High"
  }
];

export async function GET() {
  return NextResponse.json(products);
}
