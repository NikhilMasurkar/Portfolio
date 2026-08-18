import React from "react";
import ProjectShot from "../../widgets/ProjectShot.jsx";

export default function ProjectGallery({ gallery }) {
  return (
    <div className="grid grid-cols-1 gap-6 min-[900px]:grid-cols-2">
      {gallery.map((item) => (
        <figure
          key={item.src}
          className="overflow-hidden rounded-2xl border border-line bg-surface/90"
        >
          <div className="aspect-video w-full overflow-hidden">
            {/* The caption is the accessible description — these screenshots
                carry meaning, so an empty alt would drop it. */}
            <ProjectShot src={item.src} alt={item.caption} />
          </div>
          <figcaption className="border-t border-line px-4 py-3 text-sm leading-relaxed text-muted">
            {item.caption}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
