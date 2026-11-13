"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { sections, site } from "@/content/sections";
import { Grain } from "./Grain";
import styles from "./Garden.module.css";

const COUNT = sections.length;
/** Where section i sits along the line, as a fraction of its width. */
const frac = (i: number) => 0.1 + (0.8 * i) / (COUNT - 1);
const clamp = (v: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, v));

const FLAT_LINE = "M0 200 L1000 200";
const WHEEL_TEXT = `${site.statement} — `.repeat(5);

type Point = { x: number; y: number; on: number };

export function Garden() {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const blobRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<SVGPathElement>(null);
  const blurRef = useRef<SVGFEGaussianBlurElement>(null);
  const blockRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const blurWrapRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const descRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const scrollerRef = useRef<HTMLDivElement>(null);
  // Which way the line continues off screen, or null when it all fits.
  const [more, setMore] = useState<"left" | "right" | null>(null);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const update = () => {
      const hidden = scroller.scrollWidth - scroller.clientWidth;
      if (hidden <= 1) return setMore(null);
      // Point toward whichever side has more of the line left to see.
      setMore(scroller.scrollLeft < hidden / 2 ? "right" : "left");
    };
    update();
    scroller.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(scroller);
    return () => {
      scroller.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, []);

  const scrollLine = () => {
    const scroller = scrollerRef.current;
    if (!scroller || !more) return;
    scroller.scrollBy({
      left: scroller.clientWidth * 0.7 * (more === "right" ? 1 : -1),
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    if (!root || !track) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // target is where the pointer is; current eases toward it each frame.
    // x is a fraction along the line, y a fraction down the page,
    // on fades the whole effect in and out.
    const target: Point = { x: 0.5, y: 0.5, on: 0 };
    const current: Point = { x: 0.5, y: 0.5, on: 0 };
    let pointerInside = false;
    let focused = false;
    let frame = 0;

    const render = (speed: number) => {
      const { x, y, on } = current;
      const width = track.getBoundingClientRect().width;
      const height = root.getBoundingClientRect().height;

      sections.forEach((section, i) => {
        const distance = (x - frac(i)) * width;
        const near = Math.exp(-Math.pow(distance / 110, 2)) * on;
        const turn = clamp(distance / 240, -1, 1) * 34 * on;
        const tip = -(y - 0.5) * 2 * 20 * on;
        const block = blockRefs.current[i];
        if (block) {
          block.style.transform =
            `translateY(${(-near * 8).toFixed(1)}px) ` +
            `scale(${(1 + near * 0.9).toFixed(3)}) ` +
            `rotateX(${tip.toFixed(1)}deg) rotateY(${turn.toFixed(1)}deg) ` +
            `rotateZ(${(section.lean * near).toFixed(1)}deg)`;
        }
        const desc = descRefs.current[i];
        if (desc) {
          desc.style.opacity = clamp((near - 0.45) / 0.35, 0, 1).toFixed(2);
        }
      });

      // The line bows toward the pointer, only under the nearest block.
      const nearest = clamp(Math.round(((x - 0.1) / 0.8) * (COUNT - 1)), 0, COUNT - 1);
      const anchor = frac(nearest);
      const pull = Math.exp(-Math.pow(((x - anchor) * width) / 110, 2)) * on;
      const bend = clamp((y - 0.5) * height * 0.3, -26, 26) * pull;
      const half = (120 / width) * 1000;
      const start = anchor * 1000 - half;
      const end = anchor * 1000 + half;
      const peak = (anchor + (x - anchor) * 0.5) * 1000;
      const peakY = (200 + bend).toFixed(1);
      const n = (v: number) => v.toFixed(1);
      lineRef.current?.setAttribute(
        "d",
        `M0 200 L${n(start)} 200 ` +
          `C${n(start + half * 0.5)} 200 ${n(peak - half * 0.5)} ${peakY} ${n(peak)} ${peakY} ` +
          `C${n(peak + half * 0.5)} ${peakY} ${n(end - half * 0.5)} 200 ${n(end)} 200 L1000 200`,
      );

      const blur = reduceMotion ? 0 : Math.min(speed * width * 0.05, 2.4) * on;
      blurRef.current?.setAttribute("stdDeviation", `${blur.toFixed(2)} 0`);
      // Only filter while actually moving: a filter at rest softens the prints.
      const smear = blur > 0.05 ? "url(#motion-blur)" : "";
      blurWrapRefs.current.forEach((el) => {
        if (el && el.style.filter !== smear) el.style.filter = smear;
      });

      const blob = blobRef.current;
      if (blob) {
        blob.style.left = `${(x * 100).toFixed(2)}%`;
        blob.style.opacity = (0.1 + 0.26 * on).toFixed(3);
        blob.style.transform = `scaleX(${(1 + Math.min(speed * 7, 0.9)).toFixed(3)})`;
      }

      const name = nameRef.current;
      if (name) {
        name.style.transform =
          `translateY(-50%) translate(${((x - 0.5) * 34 * on).toFixed(1)}px, ` +
          `${((y - 0.5) * 18 * on).toFixed(1)}px)`;
      }
    };

    const tick = () => {
      const ease = reduceMotion ? 1 : 0.14;
      const lag = target.x - current.x;
      current.x += lag * ease;
      current.y += (target.y - current.y) * ease;
      current.on += (target.on - current.on) * (reduceMotion ? 1 : 0.1);
      render(Math.abs(target.x - current.x));
      frame = requestAnimationFrame(tick);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const line = track.getBoundingClientRect();
      const page = root.getBoundingClientRect();
      pointerInside = true;
      target.x = (e.clientX - line.left) / line.width;
      target.y = (e.clientY - page.top) / page.height;
      target.on = 1;
    };
    const onPointerLeave = () => {
      pointerInside = false;
      if (!focused) target.on = 0;
    };

    // Keyboard: focusing a section behaves like hovering it.
    const onFocusIn = (e: FocusEvent) => {
      const link = (e.target as HTMLElement).closest<HTMLElement>("[data-index]");
      if (!link) return;
      focused = true;
      target.x = frac(Number(link.dataset.index));
      target.y = 0.5;
      target.on = 1;
    };
    const onFocusOut = () => {
      focused = false;
      if (!pointerInside) target.on = 0;
    };

    // Phones: tilting the device stands in for the pointer.
    const onTilt = (e: DeviceOrientationEvent) => {
      if (e.gamma == null || pointerInside || focused) return;
      target.x = clamp(0.5 + e.gamma / 60, 0, 1);
      target.y = clamp(0.5 + ((e.beta ?? 45) - 45) / 70, 0, 1);
      target.on = 1;
    };
    // iOS only hands over orientation after a tap asks for it.
    const askForTilt = () => {
      const request = (
        window.DeviceOrientationEvent as unknown as {
          requestPermission?: () => Promise<string>;
        }
      )?.requestPermission;
      if (typeof request === "function") request().catch(() => {});
    };

    root.addEventListener("pointermove", onPointerMove);
    root.addEventListener("pointerleave", onPointerLeave);
    track.addEventListener("focusin", onFocusIn);
    track.addEventListener("focusout", onFocusOut);
    root.addEventListener("pointerdown", askForTilt, { once: true });
    window.addEventListener("deviceorientation", onTilt);
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      root.removeEventListener("pointermove", onPointerMove);
      root.removeEventListener("pointerleave", onPointerLeave);
      track.removeEventListener("focusin", onFocusIn);
      track.removeEventListener("focusout", onFocusOut);
      root.removeEventListener("pointerdown", askForTilt);
      window.removeEventListener("deviceorientation", onTilt);
    };
  }, []);

  return (
    <div ref={rootRef} className={styles.root}>
      <svg aria-hidden="true" width="0" height="0" className={styles.defs}>
        <filter id="motion-blur" x="-40%" y="-20%" width="180%" height="140%">
          <feGaussianBlur ref={blurRef} stdDeviation="0 0" />
        </filter>
      </svg>

      <h1 ref={nameRef} className={styles.name}>
        Matthew
        <br />
        <span>Mullin</span>
      </h1>

      <header className={styles.header}>
        <p className={styles.title}>{site.title}</p>
      </header>

      <svg
        className={styles.wheel}
        role="img"
        aria-label={site.statement}
        viewBox="-420 -420 840 840"
      >
        <defs>
          <path id="wheel-ring" d="M0,-360 A360,360 0 1,1 -0.01,-360" />
        </defs>
        <text>
          <textPath href="#wheel-ring" textLength="2250" lengthAdjust="spacing">
            {WHEEL_TEXT}
          </textPath>
        </text>
      </svg>

      <div ref={scrollerRef} className={styles.scroller}>
        <nav ref={trackRef} aria-label="Sections" className={styles.track}>
          <div ref={blobRef} aria-hidden="true" className={styles.blob} />
          <svg
            aria-hidden="true"
            className={styles.line}
            viewBox="0 0 1000 400"
            preserveAspectRatio="none"
          >
            <path ref={lineRef} d={FLAT_LINE} vectorEffect="non-scaling-stroke" />
          </svg>

          {sections.map((section, i) => (
            <Link
              key={section.slug}
              href={`/${section.slug}`}
              className={styles.point}
              style={{ left: `${(frac(i) * 100).toFixed(3)}%` }}
              data-index={i}
              aria-label={`${section.label}. ${section.description}`}
            >
              <span
                ref={(el) => {
                  blurWrapRefs.current[i] = el;
                }}
                className={styles.blur}
                aria-hidden="true"
              >
                <span className={styles.perspective}>
                  <span
                    ref={(el) => {
                      blockRefs.current[i] = el;
                    }}
                    className={styles.block}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={section.print.src} alt="" width={64} height={64} />
                  </span>
                </span>
              </span>
              <span className={styles.label}>{section.label}</span>
              <span
                ref={(el) => {
                  descRefs.current[i] = el;
                }}
                className={styles.description}
              >
                {section.description}
              </span>
            </Link>
          ))}
        </nav>
      </div>

      {more && (
        <button
          type="button"
          className={styles.more}
          data-side={more}
          onClick={scrollLine}
          aria-label={`Scroll the line ${more}`}
        >
          <svg aria-hidden="true" viewBox="0 0 44 16" width="44" height="16">
            <path d="M1 8 H42 M35 1.5 L42 8 L35 14.5" />
          </svg>
        </button>
      )}

      <a className={styles.credit} href={site.imageSource.href}>
        {site.imageSource.label}
      </a>

      <Grain />
    </div>
  );
}
