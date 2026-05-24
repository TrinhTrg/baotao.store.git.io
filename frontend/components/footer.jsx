"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Subscribe email:", email);
    setEmail("");
  };

  return (
    <footer className="bg-white border-t border-gray-200 pt-12 pb-6 mt-auto relative">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8">
        {/* Main footer grid: 4 columns on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Cột 1: Logo + giới thiệu ngắn */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <span className="text-2xl font-extrabold text-[#ff5000]">Bao Tao</span>
              <span className="block text-xs text-gray-500 -mt-1">Electronic Market</span>
            </Link>
            <p className="text-sm text-gray-600 leading-relaxed">
              Công nghệ tiên phong, trải nghiệm vượt trội. Mang đến sản phẩm điện tử chất lượng cao.
            </p>
            {/* Hotline đơn giản */}
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <svg className="w-4 h-4 text-[#ff5000]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>Hotline 24/7: <strong className="font-mono">(025) 3886 25 16</strong></span>
            </div>
          </div>

          {/* Cột 2: Danh mục nổi bật (Top Categories) */}
          <div>
            <h3 className="font-bold text-gray-800 text-lg mb-4 border-l-4 border-[#ff5000] pl-3">
              Danh mục nổi bật
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              {["Laptops", "PC & Computers", "Cell Phones", "Tablets", "Gaming & VR", "Networks"].map((item) => (
                <li key={item}>
                  <Link href="#" className="hover:text-[#ff5000] transition">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Cột 3: Hỗ trợ & Công ty (gộp Help Center + Company) */}
          <div>
            <h3 className="font-bold text-gray-800 text-lg mb-4 border-l-4 border-[#ff5000] pl-3">
              Hỗ trợ
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              {["Customer Service", "Track Order", "FAQs", "My Account", "Policy & Terms"].map((item) => (
                <li key={item}>
                  <Link href="#" className="hover:text-[#ff5000] transition">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Cột 4: Đăng ký nhận tin + Đối tác */}
          <div>
            <h3 className="font-bold text-gray-800 text-lg mb-4 border-l-4 border-[#ff5000] pl-3">
              Đăng ký ưu đãi
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              Nhận 10% giảm giá cho đơn hàng đầu tiên.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 mb-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email của bạn"
                required
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff5000] focus:border-transparent text-sm"
              />
              <button
                type="submit"
                className="bg-[#ff5000] text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition text-sm font-medium whitespace-nowrap cursor-pointer"
              >
                Đăng ký
              </button>
            </form>
            <div>
              <h4 className="font-semibold text-gray-800 text-sm mb-2">Đối tác</h4>
              <ul className="flex flex-wrap gap-3 text-sm text-gray-600">
                <li><Link href="#" className="hover:text-[#ff5000]">Become Seller</Link></li>
                <li><Link href="#" className="hover:text-[#ff5000]">Affiliate</Link></li>
                <li><Link href="#" className="hover:text-[#ff5000]">Partnership</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar: copyright + payment icons */}
        <div className="border-t border-gray-200 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-sm text-gray-500">
          <div>© 2025 Bao Tao. All Rights Reserved.</div>
          <div className="flex items-center gap-3">
            <span className="text-xs">Thanh toán an toàn qua</span>
            <div className="flex gap-2">
              <span className="px-2 py-1 bg-gray-100 rounded text-xs font-semibold">VISA</span>
              <span className="px-2 py-1 bg-gray-100 rounded text-xs font-semibold">MasterCard</span>
              <span className="px-2 py-1 bg-gray-100 rounded text-xs font-semibold">PayPal</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Buttons: Back to Top & Quick Chat */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
        {/* Back to Top */}
        <button
          onClick={scrollToTop}
          className={`p-3 bg-white text-gray-700 hover:text-[#ff5000] border border-gray-200 rounded-full shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl active:scale-95 cursor-pointer ${
            showBackToTop ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-10 scale-90 pointer-events-none"
          }`}
          title="Về đầu trang"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
          </svg>
        </button>

        {/* Quick Contact / Support Widget */}
        <Link
          href="/chat"
          className="p-4 bg-[#ff5000] text-white rounded-full shadow-lg transition-all duration-300 hover:bg-orange-600 hover:-translate-y-1 hover:shadow-xl active:scale-95 flex items-center justify-center group"
          title="Trò chuyện hỗ trợ"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6 animate-pulse"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
            />
          </svg>
          <span className="absolute right-14 bg-gray-900 text-white text-xs py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap shadow-md pointer-events-none">
            Trò chuyện 24/7
          </span>
        </Link>
      </div>
    </footer>
  );
}