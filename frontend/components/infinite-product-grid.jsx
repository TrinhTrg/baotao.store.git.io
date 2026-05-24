"use client";

import { useEffect, useState, useRef } from "react";
import { API_URL } from "@/lib/constants";
import ProductCard from "./product-card";

export default function InfiniteProductGrid({
  initialProducts,
  endpoint = `${API_URL}/products`,
  initialHasMore = true,
}) {
  const [products, setProducts] = useState(initialProducts);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [autoScroll, setAutoScroll] = useState(true);
  const [autoScrollCount, setAutoScrollCount] = useState(0);
  const observerTarget = useRef(null);

  useEffect(() => {
    if (!autoScroll || autoScrollCount >= 2) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          loadMoreProducts(true);
        }
      },
      { threshold: 0.1 },
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [endpoint, hasMore, loading, page, autoScroll, autoScrollCount]);

  const loadMoreProducts = async (isAuto = false) => {
    if (loading) return;
    setLoading(true);
    try {
      const nextPage = page + 1;
      const url = endpoint.includes("?")
        ? `${endpoint}&page=${nextPage}`
        : `${endpoint}?page=${nextPage}`;
      const res = await fetch(url);

      if (!res.ok) {
        throw new Error("Failed to fetch products");
      }

      const response = await res.json();

      if (response.success && response.data) {
        const newProducts = response.data.map((product) => ({
          id: product._id,
          name: product.title,
          href: `/products/${product.slug}`,
          price: `$${product.priceNew || product.price}`,
          imageSrc: product.thumbnail,
          imageAlt: product.title,
        }));

        setProducts((prev) => [...prev, ...newProducts]);
        setPage(nextPage);
        setHasMore(response.meta?.pagination?.hasNextPage || false);
        if (isAuto) {
          setAutoScrollCount((prev) => prev + 1);
        }
      }
    } catch (error) {
      console.error("Error loading more products:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-x-4 gap-y-4 py-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="grid grid-cols-1 gap-x-4 gap-y-4 py-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="aspect-square w-full rounded-lg bg-gray-200"></div>
              <div className="mt-3 h-12">
                <div className="h-4 w-3/4 rounded bg-gray-200"></div>
              </div>
              <div className="mt-1">
                <div className="h-6 w-1/3 rounded bg-gray-200"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Manual Load More Button and Auto-Scroll Toggle */}
      {hasMore && !loading && (!autoScroll || autoScrollCount >= 2) && (
        <div className="my-8 flex flex-col items-center justify-center gap-4 py-6 border border-gray-200 bg-gray-50/50 rounded-xl px-4">
          <p className="text-sm text-gray-500 text-center font-medium">
            Đã tải {page} trang sản phẩm. Bạn muốn xem thêm?
          </p>
          <button
            onClick={() => loadMoreProducts(false)}
            className="px-8 py-3 bg-[#ff5000] text-white font-bold rounded-lg shadow-md hover:bg-orange-600 active:scale-95 transition-all duration-150 tracking-wider text-sm cursor-pointer"
          >
            TẢI THÊM SẢN PHẨM
          </button>
          
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-gray-400">Chế độ tự động cuộn:</span>
            <button
              onClick={() => {
                setAutoScroll(true);
                setAutoScrollCount(0); // Reset count to let it auto-scroll more
              }}
              className="text-xs font-semibold text-[#ff5000] hover:underline cursor-pointer"
            >
              Bật lại tự động cuộn
            </button>
          </div>
        </div>
      )}

      {/* Intersection observer target */}
      {hasMore && autoScroll && autoScrollCount < 2 && (
        <div ref={observerTarget} className="h-10 flex items-center justify-center my-4">
          <div className="h-2.5 w-2.5 rounded-full bg-[#ff5000] animate-bounce mx-1"></div>
          <div className="h-2.5 w-2.5 rounded-full bg-[#ff5000] animate-bounce mx-1 [animation-delay:0.2s]"></div>
          <div className="h-2.5 w-2.5 rounded-full bg-[#ff5000] animate-bounce mx-1 [animation-delay:0.4s]"></div>
        </div>
      )}

      {/* End message */}
      {!hasMore && products.length > 0 && (
        <div className="py-12 text-center text-gray-400 text-sm font-medium border-t border-gray-100 mt-6">
          🎉 Bạn đã xem hết tất cả sản phẩm của BaoTao Electronic Market!
        </div>
      )}
    </>
  );
}
