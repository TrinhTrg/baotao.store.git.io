"use client";
import { useMemo, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function OrderSuccessSummary({ order, className = "" }) {
  const listRef = useRef(null);

  const totals = useMemo(() => {
    const items = order?.products || [];
    const subtotal = items.reduce((sum, item) => {
      const price = item.priceNew ?? item.price ?? 0;
      return sum + price * (item.quantity ?? 1);
    }, 0);
    return {
      subtotal,
      total: order?.summary?.totalPrice ?? subtotal,
      paymentMethod: order?.paymentMethod ?? order?.method ?? "cod",
      paid: !!order?.isPaid,
    };
  }, [order]);

  useEffect(() => {
    if (!listRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        listRef.current.querySelectorAll("[data-item]"),
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.35, stagger: 0.06, ease: "power2.out" },
      );

      // Micro-interactions: hover lift
      listRef.current.querySelectorAll("[data-item]").forEach((el) => {
        el.addEventListener("mouseenter", () => {
          gsap.to(el, {
            y: -2,
            scale: 1.02,
            duration: 0.18,
            ease: "power2.out",
          });
        });
        el.addEventListener("mouseleave", () => {
          gsap.to(el, { y: 0, scale: 1.0, duration: 0.2, ease: "power2.out" });
        });
        el.addEventListener("mousedown", () => {
          gsap.to(el, { scale: 0.99, duration: 0.08 });
        });
        el.addEventListener("mouseup", () => {
          gsap.to(el, { scale: 1.02, duration: 0.08 });
        });
      });
    }, listRef);
    return () => ctx.revert();
  }, []);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-xl">Order Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div ref={listRef} className="space-y-3">
          {(order?.products || []).map((item, idx) => (
            <div
              key={idx}
              data-item
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <div className="min-w-0">
                <p className="truncate font-medium">
                  {item.title ?? item.productTitle ?? "Product"}
                </p>
                <p className="text-muted-foreground text-sm">
                  Qty: {item.quantity ?? 1}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold">
                  ${(item.priceNew ?? item.price ?? 0).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
        <Separator className="my-4" />
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium">${totals.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Payment Method</span>
            <span className="font-medium uppercase">
              {totals.paymentMethod}
            </span>
          </div>
          <div className="flex items-center justify-between text-lg">
            <span className="font-semibold">Total</span>
            <span className="font-bold">${totals.total.toFixed(2)}</span>
          </div>
          {totals.paid ? (
            <p className="mt-2 text-sm text-green-700">Payment confirmed</p>
          ) : (
            <p className="mt-2 text-sm text-amber-700">
              Awaiting payment confirmation
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
