import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

const Loading = ({ message = "Loading..." }: { message?: string }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      width={"100%"}
      bgcolor={"rgba(255, 255, 255, 0.4)"}
      position={"absolute"}
      top={0}
      left={0}
      zIndex={1300}
    >
      <CircularProgress />
      <Typography variant="h6" align="center" mt={2}>
        {message}
      </Typography>
    </Box>
  );
};

export default Loading;
