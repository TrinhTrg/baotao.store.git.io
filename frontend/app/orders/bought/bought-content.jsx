"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/header";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { API_URL } from "@/lib/constants";
import { gsap } from "gsap";
import {
  buildPageNumbers,
  formatCurrency,
  formatDateTime,
} from "../order-utils";
import {
  AlertCircle,
  CheckCircle2,
  CreditCard,
  MapPin,
  PackageCheck,
  Phone,
} from "lucide-react";

const DeliveredBadge = () => (
  <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
    <span className="size-2 rounded-full bg-emerald-500" aria-hidden />
    <CheckCircle2 className="size-4" />
    Delivered
  </span>
);

const PaymentMethodPill = ({ method }) => (
  <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/70 px-3 py-1 text-xs font-semibold text-gray-700">
    <CreditCard className="size-4" />
    {method ? method.toUpperCase() : "UNKNOWN"}
  </span>
);

const EmptyState = () => (
  <div className="mx-auto max-w-2xl rounded-2xl border border-dashed border-emerald-200 bg-white/80 p-10 text-center shadow-sm">
    <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
      <PackageCheck className="size-8" />
    </div>
    <h3 className="mt-4 text-lg font-semibold text-gray-900">No Delivered Orders</h3>
    <p className="mt-2 text-sm text-gray-600">
      You haven't received any orders yet. Start shopping to see your delivered purchases here.
    </p>
  </div>
);

export default function BoughtOrdersContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageParam = Number(searchParams?.get("page")) || 1;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState(null);

  const cardRefs = useRef([]);
  const productRefs = useRef([]);

  const currentPage = useMemo(
    () => Number(pagination?.currentPage || pageParam || 1),
    [pagination, pageParam],
  );
  const totalPages = Number(pagination?.totalPages || 1);

  const fetchOrders = async (page = 1) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/checkout/boughts?page=${page}`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch delivered orders");
      }

      const payload = await response.json();
      const rawOrders = payload?.data?.orders || [];
      const paginationMeta = payload?.data?.pagination || null;

      const filteredOrders = rawOrders.filter(
        (order) =>
          order?.status?.toLowerCase() === "delivered" &&
          order?.isPaid === true,
      );

      cardRefs.current = [];
      productRefs.current = [];
      setOrders(filteredOrders);
      setPagination(paginationMeta);
    } catch (err) {
      console.error("Error loading delivered orders", err);
      setError(
        "Unable to load delivered orders right now. Please try again shortly.",
      );
      setOrders([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(pageParam);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageParam]);

  useEffect(() => {
    if (!loading && orders.length > 0) {
      // Animate cards
      cardRefs.current.forEach((card, index) => {
        if (card) {
          gsap.fromTo(
            card,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, delay: index * 0.05, duration: 0.5 },
          );
        }
      });
    }
  }, [loading, orders.length]);

  const handlePageChange = (newPage) => {
    router.push(`/orders/bought?page=${newPage}`);
  };

  const pageHref = (page) => `/orders/bought?page=${page}`;
  const pageNumbers = buildPageNumbers(currentPage, totalPages);

  if (error) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 px-4 py-20">
          <div className="mx-auto max-w-4xl">
            <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
              <AlertCircle className="size-5 text-red-600" />
              <span className="text-sm text-red-700">{error}</span>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="mx-auto max-w-6xl px-4 py-10">
          {/* Header */}
          <div className="mb-8 border-b border-gray-200 pb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Delivered Orders
            </h1>
            <p className="mt-2 text-gray-600">
              {loading
                ? "Loading your orders..."
                : `${orders.length} order${orders.length !== 1 ? "s" : ""} delivered`}
            </p>
          </div>

          {/* Orders List */}
          <div className="space-y-4">
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-48 animate-pulse rounded-xl bg-gray-300"
                  />
                ))}
              </div>
            ) : orders.length === 0 ? (
              <EmptyState />
            ) : (
              orders.map((order, index) => (
                <div
                  key={order._id}
                  ref={(el) => {
                    if (el) cardRefs.current[index] = el;
                  }}
                  className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
                >
                  {/* Order Header */}
                  <div className="border-b border-gray-100 bg-gray-50 px-6 py-4">
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                      <div>
                        <p className="text-sm text-gray-600">Order ID</p>
                        <p className="font-mono text-lg font-semibold text-gray-900">
                          {order._id?.substring(0, 12)}...
                        </p>
                      </div>
                      <div className="flex flex-col gap-3 sm:items-end">
                        <DeliveredBadge />
                        <p className="text-sm text-gray-600">
                          {formatDateTime(order.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Order Content */}
                  <div className="px-6 py-4">
                    {/* Shipping Info */}
                    <div className="mb-4 rounded-lg border border-gray-200 bg-blue-50 p-4">
                      <div className="flex items-start gap-3">
                        <MapPin className="mt-1 size-5 flex-shrink-0 text-blue-600" />
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">
                            {order?.userInfo?.fullName || "Unknown"}
                          </p>
                          <p className="text-sm text-gray-700">
                            {order?.userInfo?.address || "No address provided"}
                          </p>
                          <p className="text-sm text-gray-600">
                            {order?.userInfo?.phone || "No phone"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Products */}
                    <div className="space-y-3">
                      <p className="font-semibold text-gray-900">Products</p>
                      {order?.products?.map((item, itemIndex) => (
                        <div
                          key={itemIndex}
                          ref={(el) => {
                            if (el) productRefs.current[itemIndex] = el;
                          }}
                          className="flex gap-4 rounded-lg border border-gray-200 bg-white p-3 transition-colors hover:bg-gray-50"
                        >
                          {/* Product Image */}
                          {item?.thumbnail && (
                            <div className="relative size-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                              <Image
                                src={item.thumbnail}
                                alt={item.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}

                          {/* Product Info */}
                          <div className="flex-1 space-y-1">
                            <Link
                              href={`/products/${item?.slug}`}
                              className="text-sm font-semibold text-blue-600 hover:underline"
                            >
                              {item?.title || "Unknown Product"}
                            </Link>
                            <p className="text-xs text-gray-600">
                              Qty: {item.quantity}
                            </p>
                            <p className="text-sm font-semibold text-gray-900">
                              {formatCurrency(item.price || 0)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Summary */}
                    <div className="mt-6 border-t border-gray-200 pt-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Subtotal</span>
                          <span className="font-medium text-gray-900">
                            {formatCurrency(
                              order?.products?.reduce(
                                (sum, item) =>
                                  sum + (item.price || 0) * item.quantity,
                                0,
                              ) || 0,
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Shipping</span>
                          <span className="font-medium text-gray-900">
                            {formatCurrency(order?.shippingCost || 0)}
                          </span>
                        </div>
                        {order?.discountPercentage > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Discount</span>
                            <span className="font-medium text-green-600">
                              -{formatCurrency(order.discount)}
                            </span>
                          </div>
                        )}
                        <div className="border-t border-gray-200 pt-2">
                          <div className="flex justify-between">
                            <span className="font-semibold text-gray-900">
                              Total
                            </span>
                            <span className="text-lg font-bold text-emerald-600">
                              {formatCurrency(order?.totalOrderPrice || 0)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div className="mt-4 flex items-center gap-2">
                      <span className="text-sm text-gray-600">Payment:</span>
                      <PaymentMethodPill method={order?.method} />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {orders.length > 0 && totalPages > 1 && (
            <div className="mt-10 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href={
                        currentPage > 1 ? pageHref(currentPage - 1) : undefined
                      }
                      aria-disabled={currentPage <= 1}
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) handlePageChange(currentPage - 1);
                      }}
                    />
                  </PaginationItem>

                  {pageNumbers.map((p) => (
                    <PaginationItem key={p}>
                      <PaginationLink
                        href={pageHref(p)}
                        isActive={currentPage === p}
                        onClick={(e) => {
                          e.preventDefault();
                          handlePageChange(p);
                        }}
                      >
                        {p}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  {currentPage < totalPages - 1 && (
                    <>
                      {currentPage < totalPages - 2 && (
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )}
                      <PaginationItem>
                        <PaginationLink
                          href={pageHref(totalPages)}
                          size="default"
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(totalPages);
                          }}
                        >
                          {totalPages}
                        </PaginationLink>
                      </PaginationItem>
                    </>
                  )}

                  <PaginationItem>
                    <PaginationNext
                      href={
                        currentPage < totalPages
                          ? pageHref(currentPage + 1)
                          : undefined
                      }
                      aria-disabled={currentPage >= totalPages}
                      onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages)
                          handlePageChange(currentPage + 1);
                      }}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
