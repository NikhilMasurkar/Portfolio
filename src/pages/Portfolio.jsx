import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Chip,
  ButtonGroup,
  useTheme,
} from "@mui/material";
import { GitHub, Launch } from "@mui/icons-material";
import { projects } from "./dataStorage/PageData";

const Portfolio = () => {
  const theme = useTheme();
  const [filter, setFilter] = useState("all");

  const filteredProjects =
    filter === "all"
      ? projects
      : projects.filter((project) => project.category === filter);

  const filters = [
    { label: "All", value: "all" },
    { label: "React", value: "react" },
    { label: "React Native", value: "reactNative" },
  ];

  return (
    <Box>
      <Box
        sx={{
          mb: 4,
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          gap: 2,
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          color="text.primary"
          sx={{
            fontWeight: 600,
            position: "relative",
            "&::after": {
              content: '""',
              position: "absolute",
              bottom: -8,
              left: 0,
              width: 60,
              height: 4,
              backgroundColor: theme.palette.primary.main,
            },
          }}
        >
          Portfolio
        </Typography>

        <ButtonGroup variant="outlined" aria-label="project filters">
          {filters.map(({ label, value }) => (
            <Button
              key={value}
              onClick={() => setFilter(value)}
              variant={filter === value ? "contained" : "outlined"}
            >
              {label}
            </Button>
          ))}
        </ButtonGroup>
      </Box>

      <Grid container spacing={3}>
        {filteredProjects.map((project, index) => (
          <Grid
            size={{ xs: 12, sm: 6, md: 4 }}
            key={project.id}
            data-aos="fade-up"
            data-aos-delay={index * 100}
          >
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.3s, box-shadow 0.3s",
                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: 4,
                },
              }}
            >
              <CardMedia
                component="img"
                height="180"
                image={project.image}
                alt={project.title}
                sx={{ aspectRatio: "16/9" }}
              />

              <CardContent sx={{ flexGrow: 1 }}>
                <Typography
                  variant="h6"
                  component="h2"
                  fontWeight={600}
                  gutterBottom
                >
                  {project.title}
                </Typography>

                <Typography variant="body2" color="text.secondary" paragraph>
                  {project.description}
                </Typography>

                <Box
                  sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 2 }}
                >
                  {project.technologies.map((tech, i) => (
                    <Chip
                      key={i}
                      label={tech}
                      size="small"
                      color={i % 2 === 0 ? "primary" : "default"}
                      variant={i % 2 === 0 ? "filled" : "outlined"}
                    />
                  ))}
                </Box>
              </CardContent>

              <CardActions sx={{ p: 2, pt: 0 }}>
                {project.demoUrl && (
                  <Button
                    size="small"
                    startIcon={<Launch />}
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Live Demo
                  </Button>
                )}
                {project.githubUrl && (
                  <Button
                    size="small"
                    startIcon={<GitHub />}
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GitHub
                  </Button>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Portfolio;
