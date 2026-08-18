import React from "react";
import ProjectShot from "./ProjectShot.jsx";

/**
 * A screenshot presented in a device.
 *
 * The frame is CSS — no mockup images, nothing generated. That matters for a
 * case study: the presentation can be as polished as it likes, but the pixels
 * inside the screen have to be the real product. Redesigning a screenshot to
 * look nicer is the fastest way to make a case study untrustworthy.
 *
 * Aspect ratios match the real assets: web captures are 1400x875 (16:10), the
 * app capture is 691x1536. Matching them means `object-cover` never has to
 * crop, so no part of the interface is silently lost.
 */

export function LaptopFrame({ src, alt, eager = false, className = "" }) {
  return (
    <div className={`relative ${className}`}>
      {/* Lid */}
      <div className="rounded-t-[14px] border border-line-emphasis bg-surface-raised p-2.5 pb-0 shadow-card max-[720px]:rounded-t-[10px] max-[720px]:p-1.5">
        <div className="overflow-hidden rounded-t-[6px] border border-line bg-bg">
          <div className="aspect-[16/10] w-full">
            <ProjectShot src={src} alt={alt} eager={eager} width={1400} height={875} />
          </div>
        </div>
      </div>

      {/* Base. The notch is the trackpad cut-out — it is what reads as a
          laptop rather than a floating rectangle. */}
      <div
        aria-hidden
        className="relative h-3 rounded-b-[10px] border border-t-0 border-line-emphasis bg-[linear-gradient(180deg,var(--color-surface-raised),var(--color-surface))] max-[720px]:h-2"
      >
        <span className="absolute left-1/2 top-0 h-1 w-16 -translate-x-1/2 rounded-b-full bg-line" />
      </div>
    </div>
  );
}

export function PhoneFrame({ src, alt, eager = false, className = "" }) {
  return (
    <div
      className={`relative rounded-[30px] border border-line-emphasis bg-surface-raised p-2 shadow-card ${className}`}
    >
      <div className="relative overflow-hidden rounded-[24px] border border-line bg-bg">
        {/* Pill notch, drawn over the screenshot so the capture itself is
            untouched. */}
        <span
          aria-hidden
          className="absolute left-1/2 top-2 z-10 h-1.5 w-14 -translate-x-1/2 rounded-full bg-black/60"
        />
        <div className="aspect-[691/1536] w-full">
          <ProjectShot src={src} alt={alt} eager={eager} width={691} height={1536} />
        </div>
      </div>
    </div>
  );
}

/** Picks the frame that matches the artefact. */
export default function DeviceFrame({ src, alt, kind = "web", eager, className }) {
  const Frame = kind === "mobile" ? PhoneFrame : LaptopFrame;
  return <Frame src={src} alt={alt} eager={eager} className={className} />;
}
