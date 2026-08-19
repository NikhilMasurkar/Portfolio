import React from "react";
import Box from "@mui/material/Box";

/** Page gutter and max width, from the --container-page token. */
export default function Container({ children, className = "", ...rest }) {
  return (
    <Box className={`mx-auto w-full max-w-page px-8 ${className}`} {...rest}>
      {children}
    </Box>
  );
}
