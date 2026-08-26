import React, { useState } from "react";
import { Editor } from "@tinymce/tinymce-react";

/*
 * TinyMCE, SELF-HOSTED. Every one of these imports is deliberate.
 *
 * The cloud build wants an API key and phones home to check the domain, which
 * costs a third-party connection and stamps an unregistered-domain warning
 * across the editor. Importing the core, the model, the theme, the icons and
 * each plugin here means the whole editor is part of the admin bundle and no
 * request leaves the page. It is the same reason the fonts are self-hosted.
 *
 * TinyMCE 6, not 7 or 8: 6 is MIT, 7 is GPL-2.0-or-later and 8 ships a custom
 * licence. This code is served to a browser, which is distribution, so the
 * permissive one is the one to be on.
 *
 * Plugins are listed one by one rather than pulled in wholesale — an unused
 * plugin is dead weight in a chunk someone has to download.
 */
import "tinymce/tinymce";
import "tinymce/models/dom";
import "tinymce/themes/silver";
import "tinymce/icons/default";
import "tinymce/plugins/lists";
import "tinymce/plugins/link";
import "tinymce/plugins/image";
import "tinymce/plugins/code";
import "tinymce/plugins/codesample";
import "tinymce/plugins/table";
import "tinymce/plugins/autoresize";
import "tinymce/plugins/wordcount";
import "tinymce/skins/ui/oxide-dark/skin.min.css";

/**
 * The blog body editor.
 *
 * WHAT IT PRODUCES IS HTML, and that HTML is stored in Firestore as-is. The
 * public renderer sanitises on the way out (see widgets Markdown.jsx), because
 * sanitising only here would trust whatever ends up in the database.
 *
 * `valid_elements` is the first line of that defence rather than the only one.
 * It is an allowlist: TinyMCE will not emit a tag or attribute missing from
 * it, so pasting a script or an onclick from another page drops it at the
 * moment of paste instead of storing it and hoping the renderer catches it.
 *
 * Uncontrolled on purpose. Feeding `value` back on every keystroke makes
 * TinyMCE reset its own selection, which fights the caret exactly the way the
 * accordion key did — `initialValue` plus onEditorChange leaves the editor
 * owning its state while the form owns the saved copy.
 */
export default function RichTextField({ value, onChange }) {
  // Captured once, via the lazy initialiser: TinyMCE reads initialValue only
  // on mount, and handing it a changing value would rebuild the editor.
  const [initial] = useState(() => value ?? "");

  return (
    <Editor
      initialValue={initial}
      onEditorChange={(html) => onChange(html)}
      init={{
        // Bundled skin, so nothing is fetched at runtime. Both must be false
        // or TinyMCE requests the default CSS from a path that does not exist.
        skin: false,
        content_css: false,
        license_key: "gpl",

        menubar: false,
        branding: false,
        promotion: false,
        statusbar: true,
        plugins: [
          "lists",
          "link",
          "image",
          "code",
          "codesample",
          "table",
          "autoresize",
          "wordcount",
        ],
        toolbar:
          "undo redo | blocks | bold italic | bullist numlist | link image codesample table | removeformat code",
        // Only the levels the public post styles actually define. Offering h1
        // would let a post render a second page-level heading.
        block_formats: "Paragraph=p; Heading=h2; Subheading=h3; Quote=blockquote",
        autoresize_bottom_margin: 24,
        min_height: 420,

        // The allowlist. Anything outside it never reaches the database.
        valid_elements:
          "p,br,strong/b,em/i,u,s,blockquote,h2,h3,h4," +
          "ul,ol,li," +
          "a[href|title|target|rel]," +
          "img[src|alt|width|height|loading]," +
          "pre[class],code[class]," +
          "table,thead,tbody,tr,th[colspan|rowspan],td[colspan|rowspan],hr",
        valid_styles: {},
        invalid_elements: "script,style,iframe,object,embed,form,input",

        // External links open away from the site and cannot leak the referrer.
        link_default_target: "_blank",
        link_default_protocol: "https",
        default_link_target: "_blank",
        rel_list: [{ title: "External", value: "noopener noreferrer" }],

        // The editing surface is dark, matching the admin panel it sits in.
        content_style: `
          body { background:#0f1224; color:#e6e9f5; font-family:Inter,system-ui,sans-serif;
                 font-size:15px; line-height:1.7; padding:16px; }
          h2 { font-size:26px; margin:1.6em 0 .5em; }
          h3 { font-size:20px; margin:1.4em 0 .4em; }
          a { color:#00d4ff; }
          blockquote { border-left:2px solid #6c63ff; margin:1em 0; padding-left:1em; color:#c9d0e8; }
          pre { background:#050816; border:1px solid #1e2238; border-radius:8px; padding:12px; overflow:auto; }
          code { font-family:"JetBrains Mono",ui-monospace,monospace; font-size:13.5px; }
          img { max-width:100%; height:auto; border-radius:8px; }
          table { border-collapse:collapse; } td,th { border:1px solid #262c47; padding:6px 10px; }
        `,
      }}
    />
  );
}
