import React from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  List,
  ListItem,
  ListItemText,
  useTheme,
} from "@mui/material";
import { Building, Calendar } from "lucide-react";

const WorkExperienceCard = ({ experience }) => {
  const theme = useTheme();
  return (
    <Grid container spacing={4}>
      <Grid item xs={12} data-aos="fade-up" data-aos-delay="100">
        <Box>
          <Typography variant="h6" fontWeight={600}>
            {experience.title}
          </Typography>
          <Typography
            variant="subtitle1"
            color="primary"
            sx={{ mb: 1, display: "flex", alignItems: "center" }}
          >
            <Building size={16} style={{ marginRight: 8 }} />
            {experience.company}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 2, display: "flex", alignItems: "center" }}
          >
            <Calendar size={16} style={{ marginRight: 8 }} />
            {experience.duration}
          </Typography>

          <List sx={{ pl: 2 }}>
            {experience.points.map((text, index) => (
              <ListItem
                key={index}
                sx={{
                  display: "list-item",
                  listStyleType: "disc",
                  py: 0.5,
                }}
              >
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Grid>
    </Grid>
  );
};

export default WorkExperienceCard;
