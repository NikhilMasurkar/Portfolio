import React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import ProjectShot from "../../widgets/ProjectShot.jsx";

export default function ProjectGallery({ gallery }) {
  return (
    <Box className="grid grid-cols-1 gap-6 min-[900px]:grid-cols-2">
      {gallery.map((item) => (
        <Card
          component="figure"
          elevation={0}
          key={item.src}
          className="surface surface-interactive group overflow-hidden"
        >
          <Box className="aspect-video w-full overflow-hidden">
            {/* The caption is the accessible description — these screenshots
                carry meaning, so an empty alt would drop it. */}
            <ProjectShot
              src={item.src}
              alt={item.caption}
              className="transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transform-none"
            />
          </Box>
          <Typography
            component="figcaption"
            className="border-t border-line-inner px-4 py-3 text-sm leading-relaxed text-muted"
          >
            {item.caption}
          </Typography>
        </Card>
      ))}
    </Box>
  );
}
