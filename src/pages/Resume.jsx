import { memo, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  List,
  ListItem,
  ListItemText,
  useTheme,
} from "@mui/material";
import { Download } from "@mui/icons-material";
import { Building, GraduationCap } from "lucide-react";
import {
  educationData,
  experienceData,
  skillsData,
} from "./dataStorage/PageData";
import WorkExperienceCard from "./subComponents/WorkExperienceSection";
import EducationCard from "./subComponents/EducationCard";
import { downloadFileFromUrl } from "../_core/APP/Global/utils";
const RESUME_URL =
  "https://nikhilwebbucket.s3.eu-north-1.amazonaws.com/Nikhil_Masurkar_React_2.5%2Byears.pdf";

const Resume = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);

  const handleDownloadResume = () => {
    downloadFileFromUrl(
      RESUME_URL,
      "Nikhil_Masurkar_react_native_2.5+years.pdf",
      setLoading
    );
  };

  return (
    <Box>
      <Box
        sx={{
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
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
          Resume
        </Typography>

        <Button
          variant="contained"
          color="primary"
          startIcon={<Download />}
          onClick={handleDownloadResume}
          sx={{ borderRadius: 2 }}
          disabled={loading}
        >
          Download PDF
        </Button>
      </Box>

      {/* Work Experience Section */}
      <Paper
        elevation={0}
        sx={{
          p: 4,
          mb: 4,
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
        }}
        data-aos="fade-up"
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Building size={24} color={theme.palette.primary.main} />
          <Typography
            variant="h5"
            component="h2"
            sx={{ ml: 1, fontWeight: 600 }}
          >
            Work Experience
          </Typography>
        </Box>

        {experienceData.map((exp, index) => (
          <WorkExperienceCard key={index} experience={exp} />
        ))}
      </Paper>

      {/* Education Section */}
      <Paper
        elevation={0}
        sx={{
          p: 4,
          mb: 4,
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
        }}
        data-aos="fade-up"
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <GraduationCap size={24} color={theme.palette.primary.main} />
          <Typography
            variant="h5"
            component="h2"
            sx={{ ml: 1, fontWeight: 600 }}
          >
            Education
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {educationData.map((edu, index) => (
            <EducationCard key={index} {...edu} iconDelay={100 + index * 100} />
          ))}
        </Grid>
      </Paper>

      {/* Skills Section */}
      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
        }}
        data-aos="fade-up"
      >
        <Typography
          variant="h5"
          component="h2"
          sx={{
            mb: 3,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
          }}
        >
          <Code
            size={24}
            color={theme.palette.primary.main}
            style={{ marginRight: 8 }}
          />
          Technical Skills
        </Typography>

        <Grid container spacing={2}>
          {skillsData.map((section) => (
            <SkillSection
              key={section.title}
              title={section.title}
              skills={section.skills}
              delay={section.delay}
            />
          ))}
        </Grid>
      </Paper>
    </Box>
  );
};

const SkillSection = memo(({ title, skills, delay }) => (
  <Grid size={{ xs: 12, sm: 6 }} data-aos="fade-up" data-aos-delay={delay}>
    <Typography variant="h6" gutterBottom>
      {title}
    </Typography>
    <List dense>
      {skills.map((skill) => (
        <ListItem key={skill} sx={{ py: 0.5 }}>
          <ListItemText primary={skill} />
        </ListItem>
      ))}
    </List>
  </Grid>
));

const Code = ({ size, color, style }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
    >
      <polyline points="16 18 22 12 16 6"></polyline>
      <polyline points="8 6 2 12 8 18"></polyline>
    </svg>
  );
};

export default Resume;
