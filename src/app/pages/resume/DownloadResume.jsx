import React from "react";

/**
 * Produces the resume PDF from the page itself.
 *
 * The previous site linked a PDF sitting in an S3 bucket, which went stale the
 * moment any content changed — the site said one thing and the download said
 * another. Printing the live page means the file is generated from the same
 * Firestore data the page renders, so it cannot be out of date. Editing an
 * experience entry in the admin panel changes the download, with nothing to
 * re-export.
 *
 * The layout comes from the @media print block in src/index.css.
 */
export default function DownloadResume({ name }) {
  function handleDownload() {
    /*
     * Browsers name a printed PDF after document.title, so this is what
     * decides whether a recruiter files "Nikhil_Masurkar_Resume.pdf" or
     * "Resume — Nikhil Masurkar.pdf". Swapped for the duration of the print
     * and restored afterwards, including if the dialog is cancelled.
     */
    const original = document.title;
    document.title = `${name.replace(/\s+/g, "_")}_Resume`;

    const restore = () => {
      document.title = original;
      window.removeEventListener("afterprint", restore);
    };
    window.addEventListener("afterprint", restore);

    window.print();

    // Safari does not reliably fire afterprint; this is the backstop so the
    // tab is not left with a mangled title.
    setTimeout(restore, 1000);
  }

  return (
    <button
      type="button"
      onClick={handleDownload}
      className="inline-flex items-center gap-2.5 rounded-xl bg-[image:var(--gradient-04)] px-7 py-3.5 text-[15px] font-semibold text-fg shadow-cta transition-transform hover:-translate-y-0.5"
    >
      Download PDF <span aria-hidden>↓</span>
    </button>
  );
}
