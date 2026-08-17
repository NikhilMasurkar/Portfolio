import { Reveal } from "@/components/ui/reveal";
import { tech } from "@/data/tech";

export function TechGrid() {
  return (
    <Reveal className="rounded-[22px] border border-line bg-surface/85 shadow-card">
      <h2 className="px-8 pt-8 text-center text-[11.5px] font-semibold tracking-[0.2em] text-dim">
        TECH I WORK WITH
      </h2>

      <ul className="grid grid-cols-6 gap-6 p-8 max-[1160px]:grid-cols-4 max-[900px]:grid-cols-3 max-[720px]:grid-cols-2">
        {tech.map((item) => (
          <li key={item.name} className="flex flex-col items-center gap-3 text-center">
            <span
              aria-hidden
              className="flex h-14 w-14 items-center justify-center rounded-xl border border-line-raised bg-surface-raised font-mono text-[15px] font-semibold text-primary-text"
            >
              {item.mark}
            </span>
            <span className="text-[12.5px] text-meta">{item.name}</span>
          </li>
        ))}
      </ul>
    </Reveal>
  );
}
