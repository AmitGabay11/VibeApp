import React from "react";
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import Form from "./Form";

const LoginPage: React.FC = () => {
  const theme = useTheme(); // ✅ Define useTheme outside return
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)"); // ✅ Define outside return

  return (
    <Box>
      {/* Header Box */}
      <Box
        width="100%"
        sx={{
          backgroundColor: theme.palette.background.default,
          p: "1rem 6%",
          textAlign: "center"
        }}
      >
        <Typography fontWeight="bold" fontSize="32px" color="primary">
          Vibe
        </Typography>
      </Box>

      {/* Login Form Box */}
      <Box
        width={isNonMobileScreens ? "50%" : "93%"}
        p="2rem"
        m="2rem auto"
        borderRadius="1.5rem"
        sx={{ backgroundColor: theme.palette.background.paper }}
      >
        <Typography fontWeight="500" variant="h5" sx={{ mb: "1.5rem" }}>
          Welcome to Vibe!
        </Typography>
        <Form />
      </Box>
    </Box>
  );
};

export default LoginPage;
