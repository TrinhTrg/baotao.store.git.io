"use client";

import Link from "next/link";
import { Laptop, Smartphone, Sofa, Utensils, Shirt, Footprints, Car, Sparkles, ChevronRight } from "lucide-react";

const categories = [
  {
    name: "Laptops",
    href: "/categories/laptops",
    icon: <Laptop className="w-7 h-7 md:w-9 md:h-9 text-gray-700 transition-transform duration-300 group-hover:scale-110" />
  },
  {
    name: "Phones",
    href: "/categories/phones",
    icon: <Smartphone className="w-7 h-7 md:w-9 md:h-9 text-gray-700 transition-transform duration-300 group-hover:scale-110" />
  },
  {
    name: "Furniture",
    href: "/categories/furniture",
    icon: <Sofa className="w-7 h-7 md:w-9 md:h-9 text-gray-700 transition-transform duration-300 group-hover:scale-110" />
  },
  {
    name: "Kitchen",
    href: "/categories/kitchen",
    icon: <Utensils className="w-7 h-7 md:w-9 md:h-9 text-gray-700 transition-transform duration-300 group-hover:scale-110" />
  },
  {
    name: "Women's Wear",
    href: "/categories/women-s-wear",
    icon: <Shirt className="w-7 h-7 md:w-9 md:h-9 text-gray-700 transition-transform duration-300 group-hover:scale-110" />
  },
  {
    name: "Men's Wear",
    href: "/categories/men-s-wear",
    icon: <Shirt className="w-7 h-7 md:w-9 md:h-9 text-gray-700 transition-transform duration-300 group-hover:scale-110" />
  },
  {
    name: "Women's Shoes",
    href: "/categories/women-s-shoes",
    icon: <Footprints className="w-7 h-7 md:w-9 md:h-9 text-gray-700 transition-transform duration-300 group-hover:scale-110" />
  },
  {
    name: "Men's Shoes",
    href: "/categories/men-s-shoes",
    icon: <Footprints className="w-7 h-7 md:w-9 md:h-9 text-gray-700 transition-transform duration-300 group-hover:scale-110" />
  },
  {
    name: "Automotive",
    href: "/categories/automotive",
    icon: <Car className="w-7 h-7 md:w-9 md:h-9 text-gray-700 transition-transform duration-300 group-hover:scale-110" />
  },
  {
    name: "Accessories",
    href: "/categories/accessories",
    icon: <Sparkles className="w-7 h-7 md:w-9 md:h-9 text-gray-700 transition-transform duration-300 group-hover:scale-110" />
  }
];

export default function PopularCategories() {
  return (
    <section className="my-8 md:my-10 px-4 md:px-0">
      {/* Header section */}
      <div className="flex items-center justify-between mb-5 md:mb-6">
        <h2 className="text-lg md:text-xl font-bold text-gray-900 tracking-tight">
          Popular Categories
        </h2>
        <Link 
          href="/products" 
          className="text-xs md:text-sm font-medium text-gray-500 hover:text-[#ff5000] flex items-center gap-0.5 transition"
        >
          <span>View All</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Categories Horizontal Grid */}
      <div className="flex items-center justify-between gap-4 md:gap-5 overflow-x-auto pt-4 pb-4 scrollbar-none -mx-4 px-4 md:mx-0 md:px-0 scroll-smooth">
        {categories.map((cat, idx) => (
          <Link
            key={idx}
            href={cat.href}
            className="group flex flex-col items-center gap-2.5 flex-shrink-0 text-center cursor-pointer"
          >
            {/* Round circle container */}
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-[#ebedf3] bg-opacity-70 flex items-center justify-center border border-transparent transition-all duration-300 group-hover:border-[#ff5000] group-hover:bg-[#ff5000]/5 group-hover:shadow-[0_8px_16px_-4px_rgba(255,80,0,0.15)] group-hover:-translate-y-1">
              {cat.icon}
            </div>
            
            {/* Category label */}
            <span className="text-[11px] md:text-xs font-bold text-gray-700 tracking-tight transition-colors duration-200 group-hover:text-[#ff5000]">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
