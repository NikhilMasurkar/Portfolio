import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import { GraduationCap, Calendar } from "lucide-react";

const EducationCard = ({
  title = "",
  institution = "",
  duration = "",
  grade = "",
  iconDelay = 100,
}) => (
  <Grid item xs={12} data-aos="fade-up" data-aos-delay={iconDelay}>
    <Box>
      <Typography variant="h6" fontWeight={600}>
        {title}
      </Typography>
      <Typography
        variant="subtitle1"
        color="primary"
        sx={{ mb: 1, display: "flex", alignItems: "center" }}
      >
        <GraduationCap size={16} style={{ marginRight: 8 }} />
        {institution}
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mb: 1, display: "flex", alignItems: "center" }}
      >
        <Calendar size={16} style={{ marginRight: 8 }} />
        {duration}
      </Typography>

      <Typography variant="body1">{grade}</Typography>
    </Box>
  </Grid>
);

export default EducationCard;
