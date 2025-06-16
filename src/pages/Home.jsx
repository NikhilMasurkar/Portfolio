import React from "react";
import { Box, Typography, Grid, Paper, Button, useTheme } from "@mui/material";
import { Download, ArrowForward } from "@mui/icons-material";
import { Link } from "react-router";
import {
  Briefcase,
  Code,
  Database,
  Server,
  GitBranch,
  Bug,
} from "lucide-react";
import { aboutUsData } from "./dataStorage/PageData";

const Home = () => {
  const theme = useTheme();

  const skills = [
    { name: "React", icon: <Code size={20} /> },
    { name: "React Native", icon: <Code size={20} /> },
    { name: "JavaScript", icon: <Code size={20} /> },
    { name: "Material UI", icon: <Code size={20} /> },
    { name: "Postman", icon: <Server size={20} /> },
    { name: "AWS", icon: <Database size={20} /> },
    { name: "JIRA", icon: <Briefcase size={20} /> },
    { name: "Git & GitHub", icon: <GitBranch size={20} /> },
    { name: "Debugging", icon: <Bug size={20} /> },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          mb: 6,
          mt: 2,
          textAlign: { xs: "center", md: "left" },
        }}
        data-aos="fade-up"
      >
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 700,
            color: theme.palette.text.primary,
            mb: 2,
          }}
        >
          Designing responsive, scalable, and user-first interfaces.
        </Typography>

        <Typography
          variant="h6"
          color="text.secondary"
          paragraph
          sx={{ mb: 4, maxWidth: { md: "80%" } }}
        >
          I'm a passionate React/React Native Developer with 2+ years of
          experience building modern web and mobile applications. I enjoy
          solving real-world problems with elegant UI and clean code.
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            justifyContent: { xs: "center", md: "flex-start" },
          }}
        >
          <Button
            variant="contained"
            color="primary"
            size="large"
            component={Link}
            to="/portfolio"
            endIcon={<ArrowForward />}
          >
            View My Work
          </Button>

          <Button
            variant="outlined"
            color="primary"
            size="large"
            component={Link}
            to="/resume"
            startIcon={<Download />}
          >
            Resume
          </Button>
        </Box>
      </Box>

      {/* Skills Section */}
      <Box sx={{ mb: 8 }} data-aos="fade-up" data-aos-delay="100">
        <Typography
          variant="h4"
          component="h2"
          gutterBottom
          color="text.primary"
          sx={{
            fontWeight: 600,
            mb: 4,
            position: "relative",
            "&:after": {
              content: '""',
              position: "absolute",
              bottom: -8,
              left: 0,
              width: 60,
              height: 3,
              backgroundColor: theme.palette.primary.main,
              borderRadius: 2,
            },
          }}
        >
          My Skills
        </Typography>

        <Grid container spacing={3}>
          {skills.map((skill, index) => (
            <Grid
              size={{ xs: 6, sm: 4, md: 3 }}
              key={index}
              data-aos="zoom-in"
              data-aos-delay={100 + index * 50}
            >
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  borderRadius: 2,
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
                  },
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Box
                  sx={{
                    mb: 2,
                    color: theme.palette.primary.main,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 50,
                    height: 50,
                    borderRadius: "50%",
                    backgroundColor: "rgba(212, 175, 55, 0.1)",
                  }}
                >
                  {skill.icon}
                </Box>
                <Typography variant="h6" component="h3" fontWeight={500}>
                  {skill.name}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* About Me Section */}
      <Box sx={{ mb: 6 }} data-aos="fade-up">
        <Typography
          variant="h4"
          component="h2"
          gutterBottom
          color="text.primary"
          sx={{
            fontWeight: 600,
            mb: 4,
            position: "relative",
            "&:after": {
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
          About Me
        </Typography>

        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          {aboutUsData.map((text, index) => (
            <Typography variant="body1" paragraph key={index}>
              {text}
            </Typography>
          ))}
        </Paper>
      </Box>
    </Box>
  );
};

export default Home;
