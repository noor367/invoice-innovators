import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box, Stack, FormControl, IconButton, Modal
} from '@mui/material';
import NavBar from "./Header";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {useNavigate} from "react-router-dom";
import { createXML } from "../utils/helpers";

const CreatePage = () => {
  const navigate = useNavigate();

  // Customer Form State
  const [customerId, setCustomerId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerStreet, setCustomerStreet] = useState('');
  const [customerCity, setCustomerCity] = useState('');
  const [customerPostcode, setCustomerPostcode] = useState('');
  const [customerState, setCustomerState] = useState('');
  const [customerContactName, setCustomerContactName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');

  // Seller Form State
  const [sellerId, setSellerId] = useState('');
  const [sellerName, setSellerName] = useState('');
  const [sellerStreet, setSellerStreet] = useState('');
  const [sellerCity, setSellerCity] = useState('');
  const [sellerPostcode, setSellerPostcode] = useState('');
  const [sellerState, setSellerState] = useState('');
  const [sellerContactName, setSellerContactName] = useState('');
  const [sellerPhone, setSellerPhone] = useState('');
  const [sellerEmail, setSellerEmail] = useState('');

  // Invoice Form State
  const [invoiceId, setInvoiceId] = useState('');
  const [invoiceDate, setInvoiceDate] = useState('');
  const [buyerRef, setBuyerRef] = useState('');
  const [salesOrderRef, setSalesOrderRef] = useState('');
  const [shippingCharge, setShippingCharge] = useState(0);
  const [discountOrRebate, setDiscountOrRebate] = useState(0);
  const [dueDate, setDueDate] = useState('');

  // Payment Form State
  const [paymentId, setPaymentId] = useState('');
  const [financialAccId, setFinancialAccId] = useState('');
  const [accountName, setAccountName] = useState('');
  const [bsb, setBsb] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [xmlResponse, setXmlResponse] = useState(null);

  // Item Form State
  const [items, setItems] = useState([
    {
      itId: '',
      unitPrice: '',
      quantity: '',
      name: '',
      taxCategory: ''
    }
  ]);

  const handleAddItem = () => {
    setItems([
      ...items,
      { itId: '', unitPrice: '', quantity: '', name: '', taxCategory: ''}
    ]);
  };

  const handleRemoveItem = (index) => {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
  };

  const handleItemChange = (e, index, field) => {
    const { value } = e.target;
    const updatedItems = [...items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value
    };
    setItems(updatedItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      customer: {
        id: customerId,
        name: customerName,
        address: {
          city: customerCity,
          postCode: customerPostcode,
          state: customerState,
          streetAdd: customerStreet
        },
        contact: {
          name: customerContactName,
          phone: customerPhone,
          email: customerEmail
        }
      },
      seller: {
        id: sellerId,
        name: sellerName,
        address: {
          city: sellerCity,
          postCode: sellerPostcode,
          state: sellerState,
          streetAdd: sellerStreet
        },
        contact: {
          name: sellerContactName,
          phone: sellerPhone,
          email: sellerEmail
        }
      },
      invoice: {
        inId: invoiceId,
        date: invoiceDate,
        buyerRef: buyerRef,
        salesOrderRef: salesOrderRef,
        shippingCharge: Number(shippingCharge),
        discountOrRebate: Number(discountOrRebate),
        dueDate: dueDate,
        payment: {
          pid: paymentId,
          financialAccId: financialAccId,
          accName: accountName,
          bsb: bsb
        }
      },
      item: items.map(item => ({
        ...item,
        unitPrice: Number(item.unitPrice), // Convert to number explicitly
        quantity: Number(item.quantity) // Convert to number explicitly
      }))
    };

    const response = await createXML(formData);
    setXmlResponse(response); // Save XML response to state
    setModalOpen(true); // Open the modal
  };

  const handleDownloadConfirmation = () => {
    if (xmlResponse) {
      const blob = new Blob([xmlResponse], { type: 'application/xml' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'invoice.xml';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      setModalOpen(false); // Close the modal
    }
  };


  const handleBack = () => {
    navigate('/dashboard');
  }

  return (
    <Container maxWidth="none" disableGutters>
      <NavBar></NavBar>
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'background.paper',
            borderRadius: 8, // Rounded corners
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="modal-title" variant="h5" component="h2">
            Download Invoice?
          </Typography>
          <Typography id="modal-description" sx={{ mt: 2 }}>
            Click the button below to download the XML file.
          </Typography>
          <Button onClick={handleDownloadConfirmation}>Download</Button>
          <Button onClick={() => setModalOpen(false)}>Cancel</Button>
        </Box>
      </Modal>
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
            <Typography variant="h3" gutterBottom>Create Invoice</Typography>
          </Box>
        </Stack>
        {/* Form content */}
        <Box boxShadow={3} p={3} borderRadius={8} mb={5}>
          <form onSubmit={handleSubmit}>
            {/* Customer Information */}
            <Typography variant="h4" gutterBottom sx={{ textAlign: 'center' }} pt={3}>Customer Information</Typography>
            <FormControl fullWidth>
              {/* Customer Information */}
              <Stack spacing={2}>
                <TextField
                  name="cid"
                  label="Customer ID"
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  required
                />
                <TextField
                  name="cname"
                  label="Customer Name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                />
              </Stack>
              <Stack spacing={2} pt={2}>
                <Typography variant="h6" gutterBottom>Address</Typography>
                <TextField
                  name="cstreet"
                  label="Street"
                  value={customerStreet}
                  onChange={(e) => setCustomerStreet(e.target.value)}
                  required
                />
                <Stack direction="row" spacing={2}>
                  <TextField
                    name="ccity"
                    label="City"
                    value={customerCity}
                    onChange={(e) => setCustomerCity(e.target.value)}
                    required
                  />
                  <TextField
                    name="cpostCode"
                    label="Postcode"
                    value={customerPostcode}
                    onChange={(e) => setCustomerPostcode(e.target.value)}
                    required
                  />
                  <TextField
                    name="cstate"
                    label="State"
                    value={customerState}
                    onChange={(e) => setCustomerState(e.target.value)}
                    required
                  />
                </Stack>
              </Stack>
              <Stack spacing={2} pt={2}>
                <Typography variant="h6" gutterBottom>Contact</Typography>
                <TextField
                  name="ccname"
                  label="Name"
                  value={customerContactName}
                  onChange={(e) => setCustomerContactName(e.target.value)}
                />
                <TextField
                  name="cphone"
                  label="Phone Number"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                />
                <TextField
                  name="cemail"
                  label="Email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                />
              </Stack>
            </FormControl>
            {/* Seller Information */}
            <Typography variant="h4" gutterBottom sx={{ textAlign: 'center' }} pt={3}>Seller Information</Typography>
            <FormControl fullWidth>
              {/* Seller Information */}
              <Stack spacing={2}>
                <TextField
                  name="sid"
                  label="Seller ID"
                  value={sellerId}
                  onChange={(e) => setSellerId(e.target.value)}
                  required
                />
                <TextField
                  name="sname"
                  label="Seller Name"
                  value={sellerName}
                  onChange={(e) => setSellerName(e.target.value)}
                  required
                />
              </Stack>
              <Stack spacing={2} pt={2}>
                <Typography variant="h6" gutterBottom>Address</Typography>
                <TextField
                  name="sstreet"
                  label="Street"
                  value={sellerStreet}
                  onChange={(e) => setSellerStreet(e.target.value)}
                  required
                />
                <Stack direction="row" spacing={2}>
                  <TextField
                    name="scity"
                    label="City"
                    value={sellerCity}
                    onChange={(e) => setSellerCity(e.target.value)}
                    required
                  />
                  <TextField
                    name="spostcode"
                    label="Postcode"
                    value={sellerPostcode}
                    onChange={(e) => setSellerPostcode(e.target.value)}
                    required
                  />
                  <TextField
                    name="sstate"
                    label="State"
                    value={sellerState}
                    onChange={(e) => setSellerState(e.target.value)}
                    required
                  />
                </Stack>
              </Stack>
              <Stack spacing={2} pt={2}>
                <Typography variant="h6" gutterBottom>Contact</Typography>
                <TextField
                  name="scname"
                  label="Name"
                  value={sellerContactName}
                  onChange={(e) => setSellerContactName(e.target.value)}
                />
                <TextField
                  name="scphone"
                  label="Phone Number"
                  value={sellerPhone}
                  onChange={(e) => setSellerPhone(e.target.value)}
                />
                <TextField
                  name="scemail"
                  label="Email"
                  value={sellerEmail}
                  onChange={(e) => setSellerEmail(e.target.value)}
                />
              </Stack>
            </FormControl>
            {/* Invoice Information */}
            <Typography variant="h4" gutterBottom sx={{ textAlign: 'center' }} pt={3}>Invoice Information</Typography>
            <FormControl fullWidth>
              <Stack spacing={2} pt={2}>
                <TextField
                  name="inId"
                  label="Invoice ID"
                  value={invoiceId}
                  onChange={(e) => setInvoiceId(e.target.value)}
                  required
                />
                <Stack spacing={1} direction="row" alignItems="center">
                  <Typography variant="body1" pl={1}>Date*:</Typography>
                  <TextField
                    name="date"
                    type="date"
                    value={invoiceDate}
                    onChange={(e) => setInvoiceDate(e.target.value)}
                    required
                    sx={{ flexGrow: 1 }}
                  />
                </Stack>
                <TextField
                  name="buyerRef"
                  label="Buyer Reference"
                  type="text"
                  value={buyerRef}
                  onChange={(e) => setBuyerRef(e.target.value)}
                />
                <TextField
                  name="salesOrderRef"
                  label="Sales Order Reference"
                  type="text"
                  value={salesOrderRef}
                  onChange={(e) => setSalesOrderRef(e.target.value)}
                />
                <TextField
                  name="shippingCharge"
                  label="Shipping Charge"
                  type="number"
                  value={shippingCharge}
                  onChange={(e) => setShippingCharge(e.target.value)}
                />
                <TextField
                  name="discountOrRebate"
                  label="Discount or Rebate"
                  type="number"
                  value={discountOrRebate}
                  onChange={(e) => setDiscountOrRebate(e.target.value)}
                />
                <Stack spacing={1} direction="row" alignItems="center">
                  <Typography variant="body1" pl={1}>Due Date:</Typography>
                  <TextField
                    name="dueDate"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    sx={{ flexGrow: 1 }}
                  />
                </Stack>
              </Stack>
              <Stack spacing={2} pt={2}>
                <Typography variant="h6" gutterBottom>Payment</Typography>
                <TextField
                  name="pid"
                  label="Payment ID"
                  value={paymentId}
                  onChange={(e) => setPaymentId(e.target.value)}
                  required
                />
                <TextField
                  name="finAccId"
                  label="Financial Account ID"
                  value={financialAccId}
                  onChange={(e) => setFinancialAccId(e.target.value)}
                  required
                />
                <TextField
                  name="accname"
                  label="Account Name"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  required
                />
                <TextField
                  name="bsb"
                  label="BSB"
                  value={bsb}
                  onChange={(e) => setBsb(e.target.value)}
                  required
                />
              </Stack>
            </FormControl>
            {/* Item Information */}
            <Typography variant="h4" gutterBottom sx={{ textAlign: 'center' }} pt={3}>Item Information</Typography>
            {items.map((item, index) => (
              <Stack key={index} spacing={2}>
                <Stack direction="row" spacing={2}>
                  <TextField
                    name={`items[${index}].itid`}
                    label="Item ID"
                    value={item.itid}
                    onChange={(e) => handleItemChange(e, index, 'itId')}
                    required
                  />
                  {/* Remove button */}
                  <Button type="button" onClick={() => handleRemoveItem(index)}>
                    Remove
                  </Button>
                </Stack>
                {/* Additional fields for item information */}
                <TextField
                  name={`items[${index}].unitPrice`}
                  label="Unit Price"
                  type="number"
                  value={item.unitPrice}
                  onChange={(e) => handleItemChange(e, index, 'unitPrice')}
                  required
                />
                <TextField
                  name={`items[${index}].quantity`}
                  label="Quantity"
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(e, index, 'quantity')}
                  required
                />
                <TextField
                  name={`items[${index}].name`}
                  label="Name"
                  value={item.name}
                  onChange={(e) => handleItemChange(e, index, 'name')}
                  required
                />
                <TextField
                  name={`items[${index}].taxCategory`}
                  label="Tax Category"
                  value={item.taxCategory}
                  onChange={(e) => handleItemChange(e, index, 'taxCategory')}
                  required
                />
              </Stack>
            ))}
            {/* Add Item button */}
            <Button type="button" onClick={handleAddItem}>
              Add Item
            </Button>

            {/* Submit button */}
            <Stack mt={2} fullWidth>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{fontSize: 20, height: 50}}
              >
                Create Invoice
              </Button>
            </Stack>
          </form>
        </Box>
      </Container>
    </Container>
  );
}

export default CreatePage;
