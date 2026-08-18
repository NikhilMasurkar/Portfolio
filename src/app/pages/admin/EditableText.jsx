import React, { useEffect, useRef } from "react";

/**
 * Edit-in-place text for the resume sheet.
 *
 * contentEditable is uncontrolled on purpose. Driving it from React state the
 * usual way rewrites the node on every keystroke, which collapses the caret to
 * the start of the field — the classic contentEditable bug. So the DOM owns
 * the text while you type, and state is updated on blur.
 *
 * The effect below writes incoming values in only when the field is NOT
 * focused. That keeps it in step when something else changes the value (a
 * reset, a load) without ever yanking the caret mid-sentence.
 */
export default function EditableText({ value, onChange, multiline = false }) {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (document.activeElement === node) return; // typing — leave it alone
    if (node.innerText !== (value ?? "")) node.innerText = value ?? "";
  }, [value]);

  return (
    <span
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      role="textbox"
      tabIndex={0}
      aria-multiline={multiline}
      onBlur={(event) => {
        const next = event.currentTarget.innerText.replace(/\u00a0/g, " ").trim();
        if (next !== (value ?? "")) onChange(next);
      }}
      onKeyDown={(event) => {
        // Enter would insert a <div> and break the print layout. Single-line
        // fields commit instead; multiline ones still take shift+enter.
        if (event.key === "Enter" && !multiline) {
          event.preventDefault();
          event.currentTarget.blur();
        }
        if (event.key === "Escape") event.currentTarget.blur();
      }}
      onPaste={(event) => {
        // Pasting from a CV or a job ad otherwise brings its markup with it,
        // which survives into the PDF.
        event.preventDefault();
        const text = event.clipboardData.getData("text/plain");
        document.execCommand("insertText", false, text);
      }}
      className="-mx-1 rounded px-1 outline-none transition-colors hover:bg-[#eef2f8] focus:bg-[#e6edf7]"
    />
  );
}
