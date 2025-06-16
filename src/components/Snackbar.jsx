import React, { useEffect, useState } from "react";
import { Snackbar } from "@mui/material";
import Alert from "@mui/material/Alert";

export const SnackBarMessage = ({
  open,
  message,
  severity,
  position,
  duration,
  handleRemoveSnackbar,
}) => {
  // const [openState, setOpenState] = React.useState(open);

  const [snackbarState, setSnackbarState] = useState({
    openMe: false,
    vertical: "bottom",
    horizontal: "center",
  });
  const { vertical, horizontal, openMe } = snackbarState;

  useEffect(() => {
    if (!snackbarState.openMe) {
      handleSnackBarOpen({
        vertical: position.vertical,
        horizontal: position.horizontal,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** used for opening of SnackBar  */

  const handleSnackBarOpen = (newState) => {
    setSnackbarState({ openMe: true, ...newState });
  };

  /** used for closing of SnackBar  */

  const handleSnackBarClose = () => {
    setSnackbarState({ ...snackbarState, openMe: false });
    // setOpenState(false);
    handleRemoveSnackbar();
  };

  return (
    <Snackbar
      anchorOrigin={{ vertical, horizontal }}
      open={openMe}
      onClose={handleSnackBarClose}
      key={vertical + horizontal}
      autoHideDuration={duration}
    >
      <Alert
        elevation={6}
        variant="filled"
        onClose={handleSnackBarClose}
        severity={severity}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};
