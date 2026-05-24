"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function SuccessIcon({ size = 120, className = "" }) {
  const containerRef = useRef(null);
  const checkRef = useRef(null);
  const ringRef = useRef(null);
  const glowRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set([containerRef.current, ringRef.current, checkRef.current], {
        opacity: 0,
        scale: 0.9,
      });

      // Draw check
      const length = checkRef.current?.getTotalLength?.() || 100;
      gsap.set(checkRef.current, {
        strokeDasharray: length,
        strokeDashoffset: length,
      });

      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

      tl.to(containerRef.current, { opacity: 1, scale: 1, duration: 0.4 })
        .to(ringRef.current, { opacity: 1, duration: 0.2 }, "<")
        .to(checkRef.current, { opacity: 1, duration: 0.2 }, "<")
        .to(checkRef.current, { strokeDashoffset: 0, duration: 0.6 })
        .to(containerRef.current, { scale: 1.03, duration: 0.18 }, "-=0.2")
        .to(containerRef.current, { scale: 1.0, duration: 0.22 });

      // Subtle glow pulse
      if (glowRef.current) {
        gsap.to(glowRef.current, {
          attr: { stdDeviation: 0.6 },
          duration: 1.6,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
        });
      }

      // Floating decorative elements loop
      gsap.to(ringRef.current, {
        rotate: 360,
        transformOrigin: "50% 50%",
        ease: "none",
        duration: 18,
        repeat: -1,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative inline-block ${className}`}
      aria-hidden="true"
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        role="img"
        aria-label="Order succeeded"
      >
        <defs>
          <filter id="softGlow">
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="0.2"
              ref={glowRef}
            />
          </filter>
        </defs>
        <circle
          ref={ringRef}
          cx="60"
          cy="60"
          r="52"
          fill="#E7F9F1"
          stroke="#C8F3E1"
          strokeWidth="4"
          filter="url(#softGlow)"
        />
        <path
          ref={checkRef}
          d="M35 62 L52 78 L86 44"
          fill="none"
          stroke="#1BB57F"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
