import React from 'react';
import { Container, Button, Box, Stack } from '@mui/material';
import { Link } from "react-router-dom";
import NavBar from "./Header";

const Dashboard = () => {
  return (
    <Container maxWidth="none" disableGutters>
      <NavBar />
      <Container
        component="main"
        maxWidth="sm"
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}
      >
        <Stack pt={10} direction="column" spacing={5} justifyContent="center">
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/dashboard/create"
            sx={{ height: '60px', fontSize: '20px' }} // Adjust height and font size
          >
            Create Invoice
          </Button>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/dashboard/upload"
            sx={{ height: '60px', fontSize: '20px' }} // Adjust height and font size
          >
            Upload Invoice
          </Button>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/dashboard/view"
            sx={{ height: '60px', fontSize: '20px' }} // Adjust height and font size
          >
            View Invoices
          </Button>
        </Stack>
      </Container>
      <Box>
      </Box>
    </Container>
  );
};

export default Dashboard;
