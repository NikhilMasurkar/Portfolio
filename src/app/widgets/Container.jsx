import React from "react";

/** Page gutter and max width, from the --container-page token. */
export default function Container({ children, className = "" }) {
  return (
    <div className={`mx-auto w-full max-w-page px-8 ${className}`}>
      {children}
    </div>
  );
}
