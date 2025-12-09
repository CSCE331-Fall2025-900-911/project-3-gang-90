import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Stack, Box, Typography } from "@mui/material";

export default function SystemSelect() {
  const navigate = useNavigate();

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <Stack spacing={3} alignItems="center">
<<<<<<< HEAD
        <Typography variant="h4">Select System</Typography>
=======
        <h1>Select System</h1>
>>>>>>> sprint-3

        <Button
          variant="contained"
          size="large"
          onClick={() => navigate("/kiosk")}
        >
          Kiosk View
        </Button>

        <Button
          variant="contained"
          size="large"
          onClick={() => navigate("/cashier")}
        >
          Cashier View
        </Button>

        <Button
          variant="contained"
          size="large"
          onClick={() => navigate("/menuboard")}
        >
          Menu Board View
        </Button>
<<<<<<< HEAD
=======
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate("/products")}
        >
          Manger view
        </Button>
>>>>>>> sprint-3
      </Stack>
    </Box>
  );
}
