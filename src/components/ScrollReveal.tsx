'use client'

import { useEffect, useRef, useState, Children, type ReactNode } from 'react'

interface ScrollRevealProps {
  children: ReactNode
  /** Extra delay in ms before the animation begins */
  delay?: number
  /** Additional class names on the wrapper element */
  className?: string
  /** IntersectionObserver threshold (0–1). Default: 0.12 */
  threshold?: number
  /** Animate only the first time the element enters the viewport. Default: true */
  once?: boolean
  /** Apply an incremental delay to each direct child. Default: false */
  stagger?: boolean
  /** Interval in ms between each staggered child. Default: 80 */
  staggerInterval?: number
}

export function ScrollReveal({
  children,
  delay = 0,
  className = '',
  threshold = 0.1,
  once = true,
  stagger = false,
  staggerInterval = 80,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    // Respect prefers-reduced-motion: show content immediately
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (motionQuery.matches) {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (once) observer.disconnect()
        } else if (!once) {
          setIsVisible(false)
        }
      },
      { threshold, rootMargin: '0px 0px -80px 0px' },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [threshold, once])

  // Non-staggered: animate the whole wrapper as one unit
  if (!stagger) {
    return (
      <div
        ref={ref}
        className={`transition-all duration-[900ms] ease-[cubic-bezier(0.22, 1, 0.36, 1)] motion-reduce:!translate-y-0 motion-reduce:!opacity-100 ${isVisible
          ? 'translate-y-0 opacity-100'
          : 'translate-y-8 opacity-0'
          } ${className}`}
        style={{ transitionDelay: delay ? `${delay}ms` : undefined }}
      >
        {children}
      </div>
    )
  }

  // Staggered: each direct child gets its own incremental delay
  const items = Children.toArray(children)

  return (
    <div ref={ref} className={className}>
      {items.map((child, index) => (
        <div
          key={index}
          className={`transition-all duration-[900ms] ease-[cubic-bezier(0.22, 1, 0.36, 1)] motion-reduce:!translate-y-0 motion-reduce:!opacity-100 ${isVisible
            ? 'translate-y-0 opacity-100'
            : 'translate-y-8 opacity-0'
            }`}
          style={{
            transitionDelay: `${delay + index * staggerInterval}ms`,
          }}
        >
          {child}
        </div>
      ))}
    </div>
  )
}
