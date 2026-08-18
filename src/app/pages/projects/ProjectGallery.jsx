import React from "react";
import ProjectShot from "../../widgets/ProjectShot.jsx";

export default function ProjectGallery({ gallery }) {
  return (
    <div className="grid grid-cols-1 gap-6 min-[900px]:grid-cols-2">
      {gallery.map((item) => (
        <figure
          key={item.src}
          className="surface surface-interactive group overflow-hidden"
        >
          <div className="aspect-video w-full overflow-hidden">
            {/* The caption is the accessible description — these screenshots
                carry meaning, so an empty alt would drop it. */}
            <ProjectShot
              src={item.src}
              alt={item.caption}
              className="transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transform-none"
            />
          </div>
          <figcaption className="border-t border-line-inner px-4 py-3 text-sm leading-relaxed text-muted">
            {item.caption}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
