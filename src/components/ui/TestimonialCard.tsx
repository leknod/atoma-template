"use client";

import { useEffect, useRef, useState } from "react";
import type { SVGProps } from "react";
import Image from "next/image";
import type { Testimonial } from "@/lib/testimonials";

function StarIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M10 1.5l2.59 5.25 5.79.84-4.19 4.08.99 5.77L10 14.77l-5.18 2.67.99-5.77L1.62 7.59l5.79-.84L10 1.5z" />
    </svg>
  );
}

export default function Testimonial({
  testimonial,
}: {
  testimonial: Testimonial;
}) {
  const textRef = useRef<HTMLParagraphElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;
    setIsTruncated(el.scrollHeight - el.clientHeight > 2);
  }, []);

  return (
    <div className="flex h-full flex-col rounded-2xl border border-border bg-background p-7 sm:p-8">
      <div className="flex items-center gap-3">
        <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full">
          <Image
            src={testimonial.avatar}
            alt=""
            fill
            sizes="44px"
            className="object-cover"
          />
        </div>
        <span className="font-sans text-sm font-semibold text-foreground">
          {testimonial.name}
        </span>
      </div>

      <div className="mt-3 flex items-center gap-1 text-accent" aria-label="5 de 5 estrellas">
        {Array.from({ length: 5 }).map((_, i) => (
          <StarIcon key={i} className="h-3.5 w-3.5" />
        ))}
      </div>

      <p
        ref={textRef}
        className={`mt-4 min-h-24 text-sm leading-relaxed text-muted-foreground ${expanded ? "" : "line-clamp-4"
          }`}
      >
        {testimonial.text}
      </p>

      {isTruncated && (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="mt-2 self-start font-sans text-xs font-medium text-primary transition-colors duration-300 hover:text-foreground"
        >
          {expanded ? "Leer menos" : "Leer más"}
        </button>
      )}
    </div>
  );
}
