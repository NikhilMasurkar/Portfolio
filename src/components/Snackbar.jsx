import { Snackbar, Alert } from "@mui/material";

export const SnackBarMessage = ({
  open,
  message,
  severity,
  position = { vertical: "top", horizontal: "center" },
  duration = 4000,
  handleRemoveSnackbar,
}) => (
  <Snackbar
    anchorOrigin={position}
    open={open}
    onClose={handleRemoveSnackbar}
    autoHideDuration={duration}
  >
    <Alert
      elevation={6}
      variant="filled"
      onClose={handleRemoveSnackbar}
      severity={severity}
    >
      {message}
    </Alert>
  </Snackbar>
);
