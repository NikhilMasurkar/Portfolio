import { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  TextField,
  Button,
  Card,
  CardContent,
  Link,
  useTheme,
  CircularProgress,
} from "@mui/material";
import { Send } from "@mui/icons-material";
import emailjs from "@emailjs/browser";
import { contactInfo } from "./dataStorage/PageData";
import { EMAILJS_CONFIG } from "../_core/APP/Global/contactConstant";
import { SnackBarMessage } from "../components/Snackbar";

const Contact = () => {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [snackBar, setSnackBar] = useState(null);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const result = await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateId,
        {
          from_name: formData.name,
          from_email: formData.email,
          subject: formData.subject,
          message: formData.message,
        },
        EMAILJS_CONFIG.publicKey
      );

      if (result.status === 200 || result.text === "OK") {
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
      }

      setSnackBar(
        <SnackBarMessage
          handleRemoveSnackbar={() => setSnackBar(null)}
          message="Message sent successfully! I'll get back to you soon."
          severity="success"
          position={{ vertical: "top", horizontal: "center" }}
          duration={4000}
        />
      );
    } catch (error) {
      setSnackBar(
        <SnackBarMessage
          handleRemoveSnackbar={() => setSnackBar(null)}
          message="Failed to send message. Please try again or contact me directly."
          severity="error"
          position={{ vertical: "top", horizontal: "center" }}
          duration={4000}
        />
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography
        variant="h4"
        component="h1"
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
        data-aos="fade-up"
      >
        Contact
      </Typography>

      <Typography
        variant="body1"
        paragraph
        sx={{ mb: 5 }}
        data-aos="fade-up"
        data-aos-delay="100"
        color="text.primary"
      >
        I am open to work and freelance opportunities. Thank you for your
        interest in getting in touch with me. I welcome your feedback,
        questions, and suggestions.
      </Typography>

      {snackBar}
      <Grid container spacing={4}>
        <Box>
          <Typography
            variant="h5"
            gutterBottom
            fontWeight={600}
            color="text.primary"
          >
            Contact Information
          </Typography>
        </Box>
        <Grid container>
          <Grid
            size={{ xs: 12, md: 5 }}
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {contactInfo.map((info, index) => (
                <Grid
                  size={{ xs: 12, md: 12, sm: 6 }}
                  key={index}
                  data-aos="fade-up"
                  data-aos-delay={300 + index * 50}
                >
                  <Card
                    elevation={0}
                    sx={{
                      height: "100%",
                      border: "1px solid",
                      borderColor: "divider",
                      transition: "transform 0.3s",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                      },
                    }}
                  >
                    <CardContent
                      sx={{ display: "flex", alignItems: "flex-start" }}
                    >
                      <Box
                        sx={{
                          mr: 2,
                          color: theme.palette.primary.main,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 40,
                          height: 40,
                          borderRadius: "50%",
                          backgroundColor: "rgba(212, 175, 55, 0.1)",
                        }}
                      >
                        {info.icon}
                      </Box>
                      <Box>
                        <Typography
                          variant="h6"
                          component="h3"
                          fontWeight={500}
                        >
                          {info.title}
                        </Typography>
                        {info.link ? (
                          <Link
                            href={info.link}
                            target={
                              info.title === "LinkedIn" ? "_blank" : undefined
                            }
                            rel={
                              info.title === "LinkedIn"
                                ? "noopener noreferrer"
                                : undefined
                            }
                            color="text.secondary"
                            underline="hover"
                          >
                            {info.content}
                          </Link>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            {info.content}
                          </Typography>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Contact Form */}
          <Grid
            size={{ xs: 12, md: 7 }}
            sx={{ mt: 1 }}
            data-aos="fade-up"
            data-aos-delay="300"
          >
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography variant="h5" gutterBottom fontWeight={600}>
                Send Me a Message
              </Typography>

              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      required
                      fullWidth
                      label="Name"
                      variant="outlined"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={loading}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      required
                      fullWidth
                      label="Email"
                      variant="outlined"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={loading}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      required
                      fullWidth
                      label="Subject"
                      variant="outlined"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      disabled={loading}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      required
                      fullWidth
                      label="Message"
                      variant="outlined"
                      name="message"
                      multiline
                      rows={4}
                      value={formData.message}
                      onChange={handleInputChange}
                      disabled={loading}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      size="large"
                      endIcon={
                        loading ? (
                          <CircularProgress size={20} color="inherit" />
                        ) : (
                          <Send />
                        )
                      }
                      sx={{ mt: 1 }}
                      disabled={loading}
                    >
                      {loading ? "Sending..." : "Send Message"}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Contact;
