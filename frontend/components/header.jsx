"use client";

import Link from "next/link";
import { useState, Fragment, useEffect } from "react";
import { Monitor, Smartphone, Sofa, Shirt, Footprints, Car, Sparkles, User, Star, ClipboardCheck, Store, Inbox } from "lucide-react";
import { API_URL } from "@/lib/constants";
import LogoutButton from "./logout-button";

// Danh sách danh mục sản phẩm cho dropdown PRODUCTS
const productsDropdownItems = [
  {
    icon: <Monitor className="w-4 h-4 text-gray-500" />,
    links: [{ text: "Laptops", href: "/categories/laptops" }]
  },
  {
    icon: <Smartphone className="w-4 h-4 text-gray-500" />,
    links: [{ text: "Phones", href: "/categories/phones" }]
  },
  {
    icon: <Sofa className="w-4 h-4 text-gray-500" />,
    links: [
      { text: "Furniture", href: "/categories/furniture" },
      { text: "Kitchen", href: "/categories/kitchen" }
    ]
  },
  {
    icon: <Shirt className="w-4 h-4 text-gray-500" />,
    links: [
      { text: "Women's Wear", href: "/categories/women-s-wear" },
      { text: "Men's Wear", href: "/categories/men-s-wear" }
    ]
  },
  {
    icon: <Footprints className="w-4 h-4 text-gray-500" />,
    links: [
      { text: "Women's Shoes", href: "/categories/women-s-shoes" },
      { text: "Men's Shoes", href: "/categories/men-s-shoes" }
    ]
  },
  {
    icon: <Car className="w-4 h-4 text-gray-500" />,
    links: [{ text: "Automotive", href: "/categories/automotive" }]
  },
  {
    icon: <Sparkles className="w-4 h-4 text-gray-500" />,
    links: [{ text: "Accessories", href: "/categories/accessories" }]
  }
];

// Danh sách các trang tĩnh cho dropdown PAGES
const pagesDropdownItems = [
  { text: "About Us", href: "/about" },
  { text: "FAQs", href: "/faq" },
  { text: "Store Setup", href: "/store-setup" },
  { text: "Contact Us", href: "/contact" }
];


// Logo component: BaoTao + Electronic Market (theo hình ảnh)
const Logo = () => (
  <Link href="/" className="flex flex-col group">
    <span className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#ff5000]">
      BaoTao
    </span>
    <span className="text-[11px] md:text-xs text-gray-500 -mt-1 font-medium tracking-wide">
      Electronic Market
    </span>
  </Link>
);

// Component giỏ hàng có hiển thị giá
const CartWithPrice = () => (
  <Link href="/cart" className="group flex flex-col items-end sm:flex-row sm:items-center gap-0.5 sm:gap-2 transition hover:opacity-80">
    <div className="flex items-center gap-1">
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="text-[#ff5000]"
      >
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
      <span className="font-bold text-gray-800 text-sm uppercase tracking-wide">CART</span>
    </div>
  </Link>
);

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [mobilePagesOpen, setMobilePagesOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/user/info`, {
      credentials: "include"
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && data?.data?.user) {
          setUser(data.data.user);
        }
      })
      .catch((err) => console.error("Error loading user info in Header:", err));
  }, []);

  const hour = new Date().getHours();
  let partOfDay = "";
  if (hour >= 5 && hour <= 12) {
    partOfDay = "Morning";
  } else if (hour >= 13 && hour <= 17) {
    partOfDay = "Afternoon";
  } else {
    partOfDay = "Evening";
  }

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">

      {/* === Main header: Logo + Navigation + Welcome/Login/Register + Cart === */}
      <div className="py-3 md:py-4 px-4 md:px-6 lg:px-8">
        <div className="max-w-[1400px] mx-auto flex flex-wrap items-center justify-between gap-y-4 gap-x-6">
          {/* Logo */}
          <Logo />

          {/* Desktop Navigation (HOME, PRODUCTS, PAGES, CONTACT) */}
          <nav className="hidden md:flex items-center gap-5 lg:gap-8 text-gray-700 font-semibold text-sm lg:text-base">
            <Link href="/" className="hover:text-[#ff5000] transition flex items-center gap-1">
              HOME
            </Link>

            {/* PRODUCTS Dropdown (Mục sản phẩm công nghệ) */}
            <div className="relative group py-2">
              <span className="hover:text-[#ff5000] group-hover:text-[#ff5000] transition flex items-center gap-1 cursor-pointer">
                PRODUCTS <span className="text-[10px] lg:text-[11px] transition-transform duration-200 group-hover:rotate-180">▼</span>
              </span>

              {/* Dropdown Menu Categories */}
              <div className="absolute left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 py-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
                <div className="flex flex-col gap-1 px-2">
                  {productsDropdownItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-orange-50/50 transition-colors duration-150"
                    >
                      <div className="flex-shrink-0 p-1.5 bg-gray-50 rounded-md transition-colors">
                        {item.icon}
                      </div>
                      <div className="flex items-center gap-1 text-sm font-medium text-gray-700">
                        {item.links.map((link, lIdx) => (
                          <Fragment key={lIdx}>
                            {lIdx > 0 && <span className="text-gray-300 mx-1">/</span>}
                            <Link
                              href={link.href}
                              className="hover:text-[#ff5000] transition-colors duration-150 py-1"
                            >
                              {link.text}
                            </Link>
                          </Fragment>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* PAGES Dropdown (Mục trang tĩnh của hệ thống) */}
            <div className="relative group py-2">
              <span className="hover:text-[#ff5000] group-hover:text-[#ff5000] transition flex items-center gap-1 cursor-pointer">
                PAGES <span className="text-[10px] lg:text-[11px] transition-transform duration-200 group-hover:rotate-180">▼</span>
              </span>

              {/* Dropdown Menu Static Pages */}
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
                <div className="flex flex-col gap-0.5 px-2">
                  {pagesDropdownItems.map((page, idx) => (
                    <Link
                      key={idx}
                      href={page.href}
                      className="hover:text-[#ff5000] hover:bg-orange-50/50 transition px-3 py-2 rounded-lg text-sm font-medium text-gray-700 block"
                    >
                      {page.text}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </nav>

          {/* Right side: Welcome/Login/Register + Cart + Mobile menu toggle */}
          <div className="flex items-center gap-4 md:gap-6">
            {/* Welcome / User Greeting */}
            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-700 font-medium">
              {user ? (
                <span className="text-gray-800">
                  GOOD {partOfDay.toUpperCase()} | <strong className="text-gray-900 font-bold">{user.fullName.toUpperCase()}</strong>
                </span>
              ) : (
                <>
                  <span className="text-gray-800">GOOD {partOfDay.toUpperCase()}</span>
                  <span className="text-gray-400">|</span>
                  <Link href="/login" className="hover:text-[#ff5000] transition">
                    SIGN IN
                  </Link>
                  <span className="text-gray-400">/</span>
                  <Link href="/register" className="hover:text-[#ff5000] transition">
                    REGISTER
                  </Link>
                </>
              )}
            </div>

            {/* Cart with price */}
            <CartWithPrice />

            {/* User Avatar & Dropdown Panel (Luôn hiển thị bên cạnh Cart) */}
            <div className="relative group py-2">
              {user ? (
                <>
                  <Link
                    href="/account/manage"
                    className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200 overflow-hidden hover:ring-2 hover:ring-[#ff5000] hover:ring-offset-2 transition-all duration-200 flex-shrink-0 cursor-pointer block"
                  >
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.fullName || "User Avatar"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-5 h-5 text-gray-500" />
                    )}
                  </Link>
                  
                  {/* Account Mega Dropdown for Authenticated User */}
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
                    {/* Top user profile part */}
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gray-100 border border-gray-200 overflow-hidden flex-shrink-0">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.fullName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-6 h-6 text-gray-500 m-auto mt-2.5" />
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900 text-base">{user.fullName}!</span>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5">
                          <LogoutButton className="hover:text-[#ff5000] transition hover:underline" />
                          <span>|</span>
                          {user.isSeller ? (
                            <a
                              href="http://localhost:3001/admin/dashboard"
                              className="hover:text-[#ff5000] transition hover:underline"
                            >
                              Store
                            </a>
                          ) : (
                            <Link
                              href="/store-setup"
                              className="hover:text-[#ff5000] transition hover:underline"
                            >
                              Store setup
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Divider line */}
                    <div className="border-t border-gray-100 my-3" />

                    {/* 4 columns Grid for User features */}
                    <div className="grid grid-cols-4 gap-1 text-center">
                      <Link
                        href="/account/favourites"
                        className="flex flex-col items-center gap-1.5 p-1.5 rounded-xl hover:bg-orange-50/50 group/item transition-colors"
                      >
                        <Star className="w-5 h-5 text-gray-600 group-hover/item:text-[#ff5000] transition-colors" />
                        <span className="text-[11px] font-medium text-gray-600 group-hover/item:text-gray-900 transition-colors">
                          Favourites
                        </span>
                      </Link>

                      <Link
                        href="/orders/bought"
                        className="flex flex-col items-center gap-1.5 p-1.5 rounded-xl hover:bg-orange-50/50 group/item transition-colors"
                      >
                        <ClipboardCheck className="w-5 h-5 text-gray-600 group-hover/item:text-[#ff5000] transition-colors" />
                        <span className="text-[11px] font-medium text-gray-600 group-hover/item:text-gray-900 transition-colors">
                          Bought
                        </span>
                      </Link>

                      <Link
                        href="/account/followings"
                        className="flex flex-col items-center gap-1.5 p-1.5 rounded-xl hover:bg-orange-50/50 group/item transition-colors"
                      >
                        <Store className="w-5 h-5 text-gray-600 group-hover/item:text-[#ff5000] transition-colors" />
                        <span className="text-[11px] font-medium text-gray-600 group-hover/item:text-gray-900 transition-colors">
                          Followings
                        </span>
                      </Link>

                      <Link
                        href="/orders"
                        className="flex flex-col items-center gap-1.5 p-1.5 rounded-xl hover:bg-orange-50/50 group/item transition-colors"
                      >
                        <Inbox className="w-5 h-5 text-gray-600 group-hover/item:text-[#ff5000] transition-colors" />
                        <span className="text-[11px] font-medium text-gray-600 group-hover/item:text-gray-900 transition-colors">
                          Orders
                        </span>
                      </Link>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center border border-gray-200 hover:ring-2 hover:ring-[#ff5000] hover:ring-offset-2 transition-all duration-200 flex-shrink-0 cursor-pointer block"
                    title="Đăng nhập"
                  >
                    <User className="w-5 h-5 text-gray-400" />
                  </Link>

                  {/* Dropdown for Guest User */}
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
                    <div className="flex flex-col gap-3 text-center">
                      <span className="font-semibold text-gray-800 text-sm">Welcome to BaoTao!</span>
                      <Link
                        href="/login"
                        className="bg-[#ff5000] hover:bg-[#e04600] text-white text-sm font-bold py-2 rounded-xl transition shadow-md block"
                      >
                        Sign in
                      </Link>
                      <div className="text-xs text-gray-500">
                        New customer?{" "}
                        <Link href="/register" className="text-[#ff5000] hover:underline font-semibold">
                          Register here
                        </Link>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Mobile menu button (chỉ hiển thị trên md trở xuống) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-[#ff5000] focus:outline-none"
              aria-label="Menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer (hiển thị khi menu mở) */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pt-3 border-t border-gray-100 flex flex-col gap-3 text-gray-700 font-medium text-sm">
            {/* PRODUCTS Mobile Accordion */}
            <div>
              <button
                onClick={() => setMobileProductsOpen(!mobileProductsOpen)}
                className="flex items-center justify-between w-full py-1 px-2 text-left hover:text-[#ff5000] focus:outline-none cursor-pointer font-medium"
              >
                <span>PRODUCTS</span>
                <span className={`text-xs transition-transform duration-200 ${mobileProductsOpen ? "rotate-180" : ""}`}>▼</span>
              </button>

              {mobileProductsOpen && (
                <div className="pl-4 mt-2 flex flex-col gap-2 border-l border-gray-100 py-1 bg-gray-50/40 rounded-r-lg">
                  {productsDropdownItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 py-1.5 px-2 text-xs text-gray-600">
                      <div className="flex-shrink-0 text-gray-400">
                        {item.icon}
                      </div>
                      <div className="flex items-center gap-1 font-medium">
                        {item.links.map((link, lIdx) => (
                          <Fragment key={lIdx}>
                            {lIdx > 0 && <span className="text-gray-300 mx-1">/</span>}
                            <Link
                              href={link.href}
                              onClick={() => {
                                setMobileMenuOpen(false);
                                setMobileProductsOpen(false);
                              }}
                              className="hover:text-[#ff5000] transition-colors py-0.5"
                            >
                              {link.text}
                            </Link>
                          </Fragment>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* PAGES Mobile Accordion */}
            <div>
              <button
                onClick={() => setMobilePagesOpen(!mobilePagesOpen)}
                className="flex items-center justify-between w-full py-1 px-2 text-left hover:text-[#ff5000] focus:outline-none cursor-pointer font-medium"
              >
                <span>PAGES</span>
                <span className={`text-xs transition-transform duration-200 ${mobilePagesOpen ? "rotate-180" : ""}`}>▼</span>
              </button>

              {mobilePagesOpen && (
                <div className="pl-4 mt-2 flex flex-col gap-1.5 border-l border-gray-100 py-1.5 bg-gray-50/40 rounded-r-lg">
                  {pagesDropdownItems.map((page, idx) => (
                    <Link
                      key={idx}
                      href={page.href}
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setMobilePagesOpen(false);
                      }}
                      className="hover:text-[#ff5000] transition-colors py-1 px-2 text-xs text-gray-600 font-medium block"
                    >
                      {page.text}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/contact"
              className="flex items-center justify-between py-1 px-2 hover:text-[#ff5000] font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              CONTACT
            </Link>
            {/* Mobile: hiển thị thêm Welcome/Login/Register hoặc Chào + Logout & các mục của tài khoản */}
            <div className="flex flex-col gap-3 pt-3 border-t border-gray-100 mt-1">
              {user ? (
                <div className="flex flex-col gap-3 px-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 overflow-hidden flex-shrink-0">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.fullName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-5 h-5 text-gray-500 m-auto mt-2.5" />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <Link
                        href="/account/manage"
                        onClick={() => setMobileMenuOpen(false)}
                        className="font-bold text-gray-900 text-sm hover:text-[#ff5000] transition"
                      >
                        {user.fullName}!
                      </Link>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5">
                        <LogoutButton className="hover:text-[#ff5000] transition hover:underline" />
                        <span>|</span>
                        {user.isSeller ? (
                          <a
                            href="http://localhost:3001/admin/dashboard"
                            className="hover:text-[#ff5000] transition hover:underline"
                          >
                            Store
                          </a>
                        ) : (
                          <Link
                            href="/store-setup"
                            onClick={() => setMobileMenuOpen(false)}
                            className="hover:text-[#ff5000] transition hover:underline"
                          >
                            Store setup
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Grid for User features on mobile */}
                  <div className="grid grid-cols-4 gap-1 text-center mt-1 bg-gray-50/60 rounded-xl p-2">
                    <Link
                      href="/account/favourites"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex flex-col items-center gap-1 py-1 group"
                    >
                      <Star className="w-4.5 h-4.5 text-gray-600 group-hover:text-[#ff5000] transition-colors" />
                      <span className="text-[10px] font-medium text-gray-600 group-hover:text-gray-900 transition-colors">Favourites</span>
                    </Link>
                    <Link
                      href="/orders/bought"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex flex-col items-center gap-1 py-1 group"
                    >
                      <ClipboardCheck className="w-4.5 h-4.5 text-gray-600 group-hover:text-[#ff5000] transition-colors" />
                      <span className="text-[10px] font-medium text-gray-600 group-hover:text-gray-900 transition-colors">Bought</span>
                    </Link>
                    <Link
                      href="/account/followings"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex flex-col items-center gap-1 py-1 group"
                    >
                      <Store className="w-4.5 h-4.5 text-gray-600 group-hover:text-[#ff5000] transition-colors" />
                      <span className="text-[10px] font-medium text-gray-600 group-hover:text-gray-900 transition-colors">Followings</span>
                    </Link>
                    <Link
                      href="/orders"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex flex-col items-center gap-1 py-1 group"
                    >
                      <Inbox className="w-4.5 h-4.5 text-gray-600 group-hover:text-[#ff5000] transition-colors" />
                      <span className="text-[10px] font-medium text-gray-600 group-hover:text-gray-900 transition-colors">Orders</span>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm px-2">
                  <span className="text-gray-800">GOOD {partOfDay.toUpperCase()}</span>
                  <span className="text-gray-400">|</span>
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#ff5000]">
                    LOG IN
                  </Link>
                  <span className="text-gray-400">/</span>
                  <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#ff5000]">
                    REGISTER
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}