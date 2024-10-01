import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Paper, Stack, IconButton, Box,
} from '@mui/material';
import NavBar from "./Header";
import {RENDERING} from "../utils/helpers";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {useNavigate} from "react-router-dom";

const URL = RENDERING + '/innovators/invoices/list';

const ViewPage = () => {
  const [invoices, setInvoices] = useState([]);
  const navigate = useNavigate();

  const fetchInvoices = async () => {
    try {
      const response = await fetch(URL, {
        method: 'GET',
        headers: {
          'token': localStorage.getItem('token'),
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      setInvoices(data);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    }
  };

  useEffect(() => {
    // Fetch invoices from the API
    fetchInvoices();
  }, []);

  const handleViewInvoice = (invoiceLink) => {
    window.open(invoiceLink, '_blank');
  };

  const handleDeleteInvoice = async (invoiceId) => {
    try {
      const response = await fetch(`http://localhost:3000/innovators/invoice/delete`, {
          method: 'DELETE',
          headers: {
            'token': localStorage.getItem('token'),
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({invoiceId: invoiceId}),
        });
        if (response.ok) {
          fetchInvoices();
        }
      // Implement the logic to delete the invoice with the given invoiceId
      // For example:
      // const response = await fetch(`http://localhost:3000/innovators/invoices/${invoiceId}`, {
      //   method: 'DELETE',
      //   headers: {
      //     'token': localStorage.getItem('token'),
      //     'Content-Type': 'application/json'
      //   }
      // });
      // if (response.ok) {
      //   // Invoice deleted successfully, update the state or fetch the updated list of invoices
      //   // setInvoices(updatedInvoices);
      // } else {
      //   throw new Error('Failed to delete invoice');
      // }
    } catch (error) {
      console.error('Error deleting invoice:', error);
    }
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  return (
    <Container maxWidth="none" disableGutters>
      <NavBar />
      <Container maxWidth="md">
        <Stack pt={2} direction="row" alignItems="center" justifyContent="space-between">
          <IconButton
            color="primary"
            startIcon={<ArrowBackIcon/>}
            onClick={handleBack}
          >
            <ArrowBackIcon/>
          </IconButton>
          <Box textAlign="center" flexGrow={1}>
            <Typography variant="h3" gutterBottom>View Invoices</Typography>
          </Box>
        </Stack>
        <TableContainer component={Paper} sx={{ border: '1px solid lightgrey', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1), 0px -4px 8px rgba(0, 0, 0, 0.1)' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.inId}>
                  <TableCell>{invoice.inId}</TableCell>
                  <TableCell>{invoice.inName}</TableCell>
                  <TableCell>{invoice.renderedDate}</TableCell>
                  <TableCell>
                    <Stack spacing={2} direction="row">
                      <Button
                        variant="contained"
                        sx={{width: 100}}
                        onClick={() => handleViewInvoice(invoice.link)}
                      >
                        View
                      </Button>
                      <Button
                        color="error"
                        variant="outlined"
                        sx={{width: 100}}
                        onClick={() => handleDeleteInvoice(invoice.inId)}
                      >
                        Delete
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </Container>
  );
};

export default ViewPage;
