"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import SuccessIcon from "@/components/ui/SuccessIcon";
import OrderSuccessSummary from "@/components/order-success-summary";
import { API_URL } from "@/lib/constants";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function OrderSuccessPage({ params }) {
  const router = useRouter();
  let orderId = null;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const pageRef = useRef(null);
  const actionsRef = useRef(null);

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      setError(null);
      orderId = (await params) || {};

      try {
        const res = await fetch(`${API_URL}/checkout/success/${orderId}`, {
          credentials: "include",
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(
            data?.error?.message || data?.message || "Failed to load order",
          );
        }
        setOrder(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (orderId) fetchOrder();
  }, [orderId]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        pageRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
      );
      if (actionsRef.current) {
        gsap.fromTo(
          actionsRef.current.children,
          { opacity: 0, y: 8 },
          {
            opacity: 1,
            y: 0,
            duration: 0.3,
            stagger: 0.08,
            ease: "power2.out",
            delay: 0.25,
          },
        );
        Array.from(actionsRef.current.children).forEach((btn) => {
          btn.addEventListener("mouseenter", () => {
            gsap.to(btn, { scale: 1.03, duration: 0.16, ease: "power2.out" });
          });
          btn.addEventListener("mouseleave", () => {
            gsap.to(btn, { scale: 1.0, duration: 0.18 });
          });
          btn.addEventListener("mousedown", () => {
            gsap.to(btn, { scale: 0.98, duration: 0.08 });
          });
          btn.addEventListener("mouseup", () => {
            gsap.to(btn, { scale: 1.02, duration: 0.1 });
          });
        });
      }
    }, pageRef);
    return () => ctx.revert();
  }, []);

  const handleDownload = () => {
    if (!order) return;
    const payload = {
      orderId,
      ...order,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `order-${orderId}-receipt.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const headline = useMemo(() => {
    if (order?.isPaid) return "Order Confirmed";
    return "Order Placed";
  }, [order]);

  return (
    <div ref={pageRef} className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <Card className="mx-auto w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <SuccessIcon size={140} />
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight">
            {headline}
          </CardTitle>
          <CardDescription className="mt-2 text-base">
            {order?.isPaid
              ? "Thank you! Your payment has been processed successfully."
              : "Thank you! Your order has been placed and is being processed."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading && (
            <div className="text-muted-foreground py-6 text-center">
              Loading order details…
            </div>
          )}
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
              <p className="mb-1 font-medium">Error</p>
              {error}
            </div>
          )}
          {!loading && !error && order && (
            <div className="space-y-6">
              <div className="bg-card rounded-xl border p-4 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-muted-foreground text-sm">Order ID</p>
                    <p className="font-semibold">{orderId}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Status</p>
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${order.isPaid ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}
                    >
                      {order.isPaid ? "Paid" : "Pending"}
                    </span>
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-muted-foreground text-sm">Recipient</p>
                    <p className="font-medium">
                      {order.userInfo?.fullName ?? "—"}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {order.userInfo?.address ?? "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Payment</p>
                    <p className="font-medium uppercase">
                      {order.paymentMethod ?? order.method ?? "cod"}
                    </p>
                  </div>
                </div>
              </div>

              <OrderSuccessSummary order={order} />

              <div
                ref={actionsRef}
                className="flex flex-wrap items-center justify-center gap-3"
              >
                <Button
                  aria-label="Continue shopping"
                  onClick={() => router.push("/products")}
                >
                  Continue Shopping
                </Button>
                <Button
                  aria-label="View orders"
                  variant="secondary"
                  onClick={() => router.push("/orders")}
                >
                  View Orders
                </Button>
                <Button
                  aria-label="Download receipt"
                  variant="outline"
                  onClick={handleDownload}
                >
                  Download Receipt
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      <p className="sr-only" role="status" aria-live="polite">
        {order?.isPaid ? "Payment successful." : "Order placed."}
      </p>
    </div>
  );
}
