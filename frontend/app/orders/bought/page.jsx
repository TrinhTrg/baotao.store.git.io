"use client";

import { Suspense } from "react";
import BoughtOrdersContent from "./bought-content";

export default function BoughtPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <BoughtOrdersContent />
    </Suspense>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="mx-auto max-w-6xl px-4 py-20">
        <div className="space-y-4">
          <div className="h-10 w-48 animate-pulse rounded-lg bg-gray-300" />
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 animate-pulse rounded-lg bg-gray-300" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
