import { ProjectShot } from "@/components/ui/project-shot";
import type { Project } from "@/data/schemas";

export function ProjectGallery({
  gallery,
}: {
  gallery: NonNullable<Project["gallery"]>;
}) {
  return (
    <div className="grid grid-cols-1 gap-6 min-[900px]:grid-cols-2">
      {gallery.map((item) => (
        <figure
          key={item.src}
          className="overflow-hidden rounded-2xl border border-line bg-surface/90"
        >
          <div className="aspect-video w-full overflow-hidden">
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
