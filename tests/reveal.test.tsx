import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Reveal } from "@/components/ui/reveal";

/**
 * The contract: server-rendered markup must NEVER hide content.
 *
 * The previous implementation used framer-motion's `whileInView`, which
 * server-renders its `initial` state — the served HTML carried
 * `opacity:0;transform:translateY(26px)` on every wrapped block. With JS
 * blocked or hydration broken, the page rendered as a hero and a footer with
 * nothing in between. These tests fail if that regresses.
 */
describe("Reveal server markup", () => {
  const html = renderToStaticMarkup(
    <Reveal>
      <p>visible content</p>
    </Reveal>,
  );

  it("renders its children", () => {
    expect(html).toContain("visible content");
  });

  it("does not ship opacity:0", () => {
    expect(html).not.toMatch(/opacity\s*:\s*0/);
  });

  it("does not ship a translate transform", () => {
    expect(html).not.toMatch(/translateY/);
  });

  it("marks the block so CSS can hide it once JS is alive", () => {
    expect(html).toContain("data-reveal");
  });

  it("passes a delay through as a custom property, not as inline opacity", () => {
    const delayed = renderToStaticMarkup(
      <Reveal delay={0.24}>
        <p>delayed</p>
      </Reveal>,
    );
    expect(delayed).toContain("--reveal-delay:0.24s");
    expect(delayed).not.toMatch(/opacity\s*:\s*0/);
  });
});
